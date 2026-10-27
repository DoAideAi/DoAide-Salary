import { Link } from 'react-router-dom';
import { ARTICLES as articles } from '../data/blog';

export default function Blog() {
  return (
    <div className="page">
      <h1 className="page-title">Salary & Tax <span className="accent-text">Blog</span></h1>
      <p className="page-subtitle">Expert guides for Indian professionals</p>

      <div className="blog-list">
        {articles.map((article) => (
          <Link to={`/blog/${article.slug}`} key={article.slug} style={{ textDecoration: 'none' }}>
            <div className="blog-card">
              <div className="blog-meta">{article.date} &middot; {article.readTime}</div>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
