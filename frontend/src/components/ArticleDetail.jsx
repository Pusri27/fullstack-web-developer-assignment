import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../services/api';
import './ArticleDetail.css';

function ArticleDetail() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('original'); // original, enhanced, comparison

    useEffect(() => {
        fetchArticle();
    }, [slug]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await articleService.getArticle(slug);
            setArticle(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch article');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading article...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="error-container">
                <h2>⚠️ Article Not Found</h2>
                <p>{error || 'The article you are looking for does not exist.'}</p>
                <Link to="/" className="back-button">← Back to Articles</Link>
            </div>
        );
    }

    return (
        <div className="article-detail-container">
            <Link to="/" className="back-link">← Back to Articles</Link>

            <article className="article-detail">
                <header className="article-header">
                    {article.image_url && (
                        <div className="article-hero-image">
                            <img src={article.image_url} alt={article.title} />
                        </div>
                    )}
                    <div className="article-meta-header">
                        {article.is_enhanced && (
                            <span className="badge enhanced">✨ Enhanced with AI</span>
                        )}
                        {article.author && (
                            <span className="author-info">By {article.author}</span>
                        )}
                        {article.published_at && (
                            <span className="publish-date">
                                {new Date(article.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        )}
                    </div>
                    <h1 className="article-title">{article.title}</h1>
                    {article.excerpt && (
                        <p className="article-excerpt">{article.excerpt}</p>
                    )}
                </header>

                {article.is_enhanced && (
                    <div className="view-mode-selector">
                        <button
                            className={viewMode === 'original' ? 'active' : ''}
                            onClick={() => setViewMode('original')}
                        >
                            📝 Original
                        </button>
                        <button
                            className={viewMode === 'enhanced' ? 'active' : ''}
                            onClick={() => setViewMode('enhanced')}
                        >
                            ✨ Enhanced
                        </button>
                        <button
                            className={viewMode === 'comparison' ? 'active' : ''}
                            onClick={() => setViewMode('comparison')}
                        >
                            🔄 Compare
                        </button>
                    </div>
                )}

                {viewMode === 'comparison' && article.is_enhanced ? (
                    <div className="comparison-view">
                        <div className="content-column original-column">
                            <h2>📝 Original Content</h2>
                            <div className="content-text">{article.content}</div>
                        </div>
                        <div className="content-column enhanced-column">
                            <h2>✨ Enhanced Content</h2>
                            <div className="content-text">{article.enhanced_content}</div>
                            {article.citations && article.citations.length > 0 && (
                                <div className="citations-section">
                                    <h3>📚 References</h3>
                                    <ol className="citations-list">
                                        {article.citations.map((citation, index) => (
                                            <li key={index}>
                                                <a href={citation} target="_blank" rel="noopener noreferrer">
                                                    {new URL(citation).hostname.replace('www.', '')}
                                                </a>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="single-content-view">
                        <div className="content-text">
                            {viewMode === 'enhanced' && article.enhanced_content
                                ? article.enhanced_content
                                : article.content}
                        </div>
                        {viewMode === 'enhanced' && article.citations && article.citations.length > 0 && (
                            <div className="citations-section">
                                <h3>📚 References</h3>
                                <ol className="citations-list">
                                    {article.citations.map((citation, index) => (
                                        <li key={index}>
                                            <a href={citation} target="_blank" rel="noopener noreferrer">
                                                {new URL(citation).hostname.replace('www.', '')}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                )}

                {article.metadata && (
                    <div className="article-metadata">
                        <h3>📊 Article Information</h3>
                        <div className="metadata-grid">
                            {article.metadata.read_time && (
                                <div className="metadata-item">
                                    <span className="label">Read Time:</span>
                                    <span className="value">{article.metadata.read_time} min</span>
                                </div>
                            )}
                            {article.metadata.views && (
                                <div className="metadata-item">
                                    <span className="label">Views:</span>
                                    <span className="value">{article.metadata.views.toLocaleString()}</span>
                                </div>
                            )}
                            {article.metadata.category && (
                                <div className="metadata-item">
                                    <span className="label">Category:</span>
                                    <span className="value">{article.metadata.category}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="article-footer">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="source-link">
                        View Original Source →
                    </a>
                </div>
            </article>
        </div>
    );
}

export default ArticleDetail;
