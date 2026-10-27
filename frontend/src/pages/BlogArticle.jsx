import { useParams, Link } from 'react-router-dom';
import { ARTICLES as articles, ARTICLE_CONTENT as content } from '../data/blog';

export default function BlogArticle() {
  const { slug } = useParams();
  const article = content[slug];
  const meta = articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="page" style={{ textAlign: 'center' }}>
        <h1>Article Not Found</h1>
        <Link to="/blog" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="blog-content">
        <Link to="/blog" style={{ fontSize: '14px' }}>&larr; Back to Blog</Link>
        <h1 style={{ fontSize: '32px', marginTop: '16px', marginBottom: '8px' }}>{article.title}</h1>
        {meta && <p className="blog-meta">{meta.date} &middot; {meta.readTime}</p>}
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
      </div>
    </div>
  );
}
