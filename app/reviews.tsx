import reviews from "./reviews.json";

function ReviewCard({ quote, name }: { quote: string; name: string }) {
  return <figure className="customer-review">
    <span className="review-stars" role="img" aria-label="5 מתוך 5 כוכבים">★★★★★</span>
    <blockquote>{quote}</blockquote>
    <figcaption><span className="review-avatar" aria-hidden="true">{name[0]}</span><span><strong dir="auto">{name}</strong><small>ביקורת לקוח · Google</small></span></figcaption>
  </figure>;
}

export default function Reviews() {
  return <section className="customer-reviews section" id="reviews" aria-labelledby="reviews-title">
    <div className="reviews-heading"><div><p className="eyebrow">לקוחות מספרים</p><h2 id="reviews-title">לקוחות שכבר<br /><em>ישנים בשקט.</em></h2></div><p>על הבדיקה, על השירות ועל הליווי —<br />במילים של הלקוחות שלנו.</p></div>
    <div className="reviews-grid">{reviews.slice(0, 3).map(review => <ReviewCard key={review.name} {...review} />)}</div>
    <details className="more-reviews"><summary><span className="reviews-show">לכל ההמלצות ({reviews.length})</span><span className="reviews-hide">הצגת פחות המלצות</span><span className="reviews-toggle" aria-hidden="true">＋</span></summary><div className="reviews-grid">{reviews.slice(3).map(review => <ReviewCard key={review.name} {...review} />)}</div></details>
  </section>;
}
