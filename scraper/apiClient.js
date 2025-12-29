import axios from 'axios';

/**
 * API Client for Laravel Backend
 * Handles communication with the article API
 */
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || process.env.API_BASE_URL || 'http://localhost:8000/api';
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    /**
     * Fetch all articles from API
     * @param {Object} params - Query parameters
     * @returns {Promise<Array>} Array of articles
     */
    async getArticles(params = {}) {
        try {
            const response = await this.client.get('/articles', { params });
            return response.data.data || [];
        } catch (error) {
            console.error('Failed to fetch articles:', error.message);
            throw error;
        }
    }

    /**
     * Get single article by slug
     * @param {string} slug - Article slug
     * @returns {Promise<Object>} Article object
     */
    async getArticle(slug) {
        try {
            const response = await this.client.get(`/articles/${slug}`);
            return response.data.data;
        } catch (error) {
            console.error(`Failed to fetch article ${slug}:`, error.message);
            throw error;
        }
    }

    /**
     * Update article
     * @param {string} slug - Article slug
     * @param {Object} data - Article data to update
     * @returns {Promise<Object>} Updated article
     */
    async updateArticle(slug, data) {
        try {
            const response = await this.client.put(`/articles/${slug}`, data);
            return response.data.data;
        } catch (error) {
            console.error(`Failed to update article ${slug}:`, error.message);
            throw error;
        }
    }

    /**
     * Get non-enhanced articles
     * @returns {Promise<Array>} Array of non-enhanced articles
     */
    async getNonEnhancedArticles() {
        return await this.getArticles({ is_enhanced: 0 });
    }
}

export default ApiClient;
