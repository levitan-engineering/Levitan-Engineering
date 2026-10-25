begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table public.customer_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  name text not null check (char_length(btrim(name)) between 2 and 80),
  service text not null check(service in ('דירה חדשה מקבלן','בדיקת דירה יד שנייה','חוות דעת הנדסית','בדיקת שטחים משותפים','שירות אחר')),
  rating smallint not null check(rating between 1 and 5),
  quote text not null check(char_length(btrim(quote)) between 10 and 2000),
  consent boolean not null check(consent = true),
  consent_version text not null default '2026-10-25',
  status text not null default 'pending' check(status in ('pending','approved','rejected','removed')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  constraint approval_time check(status <> 'approved' or approved_at is not null)
);
create index reviews_public_order on public.customer_reviews(approved_at,id) where status='approved';
create index reviews_moderation on public.customer_reviews(status,created_at desc);
alter table public.customer_reviews enable row level security;
revoke all on public.customer_reviews from public, anon, authenticated;
grant select,insert,update on public.customer_reviews to service_role;
create table private.review_admins(user_id uuid primary key references auth.users(id) on delete cascade);
create table private.review_rate_limits(bucket text primary key, attempts integer not null default 1, expires_at timestamptz not null);
create table private.review_audit(id bigint generated always as identity primary key, review_id uuid not null references public.customer_reviews(id), actor_id uuid not null, previous_status text not null, new_status text not null, created_at timestamptz not null default now());
-- Only server-side service_role may call these functions; no browser writes exist.
create function public.review_is_admin(actor uuid) returns boolean language sql security definer set search_path='' as $$ select exists(select 1 from private.review_admins where user_id=actor); $$;
create function public.review_rate_limit(bucket_key text) returns boolean language plpgsql security definer set search_path='' as $$
declare n integer;
begin
  delete from private.review_rate_limits where expires_at < now();
  insert into private.review_rate_limits(bucket,expires_at) values(bucket_key,now()+interval '1 hour')
    on conflict(bucket) do update set attempts=private.review_rate_limits.attempts+1 returning attempts into n;
  return n<=5;
end; $$;
create function public.review_moderate(review uuid,actor uuid,target text,expected text) returns boolean language plpgsql security definer set search_path='' as $$
declare previous text;
begin
  if not exists(select 1 from private.review_admins where user_id=actor) then raise exception 'Forbidden' using errcode='42501'; end if;
  if target not in ('approved','rejected','removed') then raise exception 'Invalid status'; end if;
  select status into previous from public.customer_reviews where id=review for update;
  if previous is null or previous<>expected then return false; end if;
  update public.customer_reviews set status=target,approved_at=case when target='approved' then coalesce(approved_at,now()) else approved_at end where id=review;
  insert into private.review_audit(review_id,actor_id,previous_status,new_status) values(review,actor,previous,target);
  return true;
end; $$;
revoke all on function public.review_is_admin(uuid),public.review_rate_limit(text),public.review_moderate(uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.review_is_admin(uuid),public.review_rate_limit(text),public.review_moderate(uuid,uuid,text,text) to service_role;
commit;
