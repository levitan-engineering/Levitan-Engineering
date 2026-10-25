import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, validateSubmission } from '../supabase/functions/reviews/handler.ts';
const valid = {name:'לקוח אמיתי',quote:'בדיקה מקצועית ויסודית מאוד',service:'דירה חדשה מקבלן',rating:5,consent:true,submissionId:'11111111-1111-4111-8111-111111111111',website:'',captchaToken:'token'};
const values = {REVIEW_ALLOWED_ORIGINS:'https://example.com',SUPABASE_URL:'https://db.example',SUPABASE_SERVICE_ROLE_KEY:'server-only',TURNSTILE_SECRET_KEY:'secret',REVIEW_RATE_LIMIT_SALT:'test-salt'};
function setup(overrides: Record<string,unknown> = {}) {
 const calls: {url:string;options:any}[]=[];
 const fetcher = async (url: any, options:any={}) => {calls.push({url:String(url),options}); let result: unknown=true;let status=200;
 if(String(url).includes('/auth/')) result={id:'admin-id'};
 if(String(url).includes('review_is_admin')) result=overrides.admin ?? true;
 if(String(url).includes('review_rate_limit')) result=overrides.rate ?? true;
 if(String(url).includes('siteverify')) result=overrides.captcha ?? {success:true,action:'review-submit',hostname:'example.com'};
 if(String(url).includes('customer_reviews?')) {result=[];if(options.method==='POST'){status=overrides.dbFail?500:204;}}
 if(String(url).includes('review_moderate')) result=overrides.changed ?? true;
 return new Response(status===204?null:JSON.stringify(result),{status}); };
 const handler=createHandler({env:{get:(key:string)=>values[key]},fetcher:fetcher as typeof fetch});
 const request=(method='POST',body:unknown=valid,headers={})=>new Request('https://edge.example/reviews',{method,headers:{origin:'https://example.com',...headers},...(method==='GET'?{}:{body:JSON.stringify(body)})});
 return {handler,request,calls};
}
test('validation rejects bad rating, missing consent, bots and null',()=>{assert.ok(validateSubmission(valid));for(const change of [{rating:0},{rating:6},{consent:false},{website:'spam'}]) assert.equal(validateSubmission({...valid,...change}),false);assert.equal(validateSubmission(null as any),false)});
test('public reads approved reviews only',async()=>{const s=setup();assert.equal((await s.handler(s.request('GET'))).status,200);assert.match(s.calls[0].url,/status=eq.approved/);});
test('admin authentication and allowlist enforced',async()=>{const s=setup({admin:false});assert.equal((await s.handler(s.request('PATCH',{}))).status,401);assert.equal((await s.handler(s.request('PATCH',{}, {authorization:'Bearer test'}))).status,403);});
test('invalid captcha cannot insert',async()=>{const s=setup({captcha:{success:false}});assert.equal((await s.handler(s.request())).status,400);assert.ok(!s.calls.some(c=>c.url.includes('customer_reviews')));});
test('rate limit blocks submission',async()=>{const s=setup({rate:false});assert.equal((await s.handler(s.request())).status,429);assert.ok(!s.calls.some(c=>c.url.includes('siteverify')));});
test('database failure never reports success',async()=>{const s=setup({dbFail:true});assert.equal((await s.handler(s.request())).status,503);});
test('submission always enters pending despite supplied status',async()=>{const s=setup();const response=await s.handler(s.request('POST',{...valid,status:'approved'}));assert.equal(response.status,201);const insert=s.calls.find(c=>c.url.includes('customer_reviews'));assert.equal(JSON.parse(insert!.options.body).status,'pending');});
test('moderation uses authenticated actor and detects concurrent edits',async()=>{const s=setup({changed:false});const response=await s.handler(s.request('PATCH',{id:valid.submissionId,status:'approved',expected:'pending',actor:'attacker'},{authorization:'Bearer test'}));assert.equal(response.status,409);const call=s.calls.find(c=>c.url.includes('review_moderate'));assert.equal(JSON.parse(call!.options.body).actor,'admin-id');});
test('unapproved origin rejected',async()=>{const s=setup();assert.equal((await s.handler(s.request('POST',valid,{origin:'https://attacker.example'}))).status,403);assert.equal(s.calls.length,0);});
