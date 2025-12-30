import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * Article API Service
 */
export const articleService = {
    /**
     * Get all articles with pagination
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getArticles: async (params = {}) => {
        const response = await apiClient.get('/articles', { params });
        return response.data;
    },

    /**
     * Get single article by slug
     * @param {string} slug - Article slug
     * @returns {Promise} API response
     */
    getArticle: async (slug) => {
        const response = await apiClient.get(`/articles/${slug}`);
        return response.data;
    },

    /**
     * Get enhanced version of article
     * @param {string} slug - Article slug
     * @returns {Promise} API response
     */
    getEnhancedArticle: async (slug) => {
        const response = await apiClient.get(`/articles/${slug}/enhanced`);
        return response.data;
    }
};

export default apiClient;
