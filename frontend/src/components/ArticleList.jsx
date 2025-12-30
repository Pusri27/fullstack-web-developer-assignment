import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../services/api';
import './ArticleList.css';

function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchArticles();
    }, [currentPage, filter]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: currentPage,
                per_page: 10
            };

            if (filter === 'enhanced') {
                params.is_enhanced = 1;
            } else if (filter === 'original') {
                params.is_enhanced = 0;
            }

            const response = await articleService.getArticles(params);
            setArticles(response.data || []);
            setTotalPages(response.meta?.total_pages || 1);
        } catch (err) {
            setError(err.message || 'Failed to fetch articles');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading articles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>⚠️ Error</h2>
                <p>{error}</p>
                <button onClick={fetchArticles}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="article-list-container">
            <header className="list-header">
                <h1>📚 BeyondChats Articles</h1>
                <p className="subtitle">Explore our collection of articles with AI-enhanced content</p>
            </header>

            <div className="filter-bar">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => handleFilterChange('all')}
                >
                    All Articles
                </button>
                <button
                    className={filter === 'enhanced' ? 'active' : ''}
                    onClick={() => handleFilterChange('enhanced')}
                >
                    ✨ Enhanced
                </button>
                <button
                    className={filter === 'original' ? 'active' : ''}
                    onClick={() => handleFilterChange('original')}
                >
                    📝 Original
                </button>
            </div>

            {articles.length === 0 ? (
                <div className="empty-state">
                    <h2>No articles found</h2>
                    <p>Try changing the filter or check back later.</p>
                </div>
            ) : (
                <>
                    <div className="articles-grid">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/article/${article.slug}`}
                                className="article-card"
                            >
                                {article.image_url && (
                                    <div className="article-image">
                                        <img src={article.image_url} alt={article.title} />
                                    </div>
                                )}
                                <div className="article-content">
                                    <div className="article-meta">
                                        {article.is_enhanced && (
                                            <span className="badge enhanced">✨ Enhanced</span>
                                        )}
                                        {article.author && (
                                            <span className="author">By {article.author}</span>
                                        )}
                                    </div>
                                    <h2 className="article-title">{article.title}</h2>
                                    {article.excerpt && (
                                        <p className="article-excerpt">{article.excerpt}</p>
                                    )}
                                    <div className="article-footer">
                                        {article.published_at && (
                                            <span className="date">
                                                {new Date(article.published_at).toLocaleDateString()}
                                            </span>
                                        )}
                                        <span className="read-more">Read more →</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ← Previous
                            </button>
                            <span className="page-info">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ArticleList;
