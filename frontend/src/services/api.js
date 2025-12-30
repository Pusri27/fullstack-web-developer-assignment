import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10 second timeout
});

// Add request interceptor for error handling
apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message || error.response.statusText;
            throw new Error(message);
        } else if (error.request) {
            // Request made but no response
            throw new Error('No response from server. Please check your connection.');
        } else {
            // Error in request setup
            throw new Error(error.message || 'An error occurred');
        }
    }
);

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
        try {
            const response = await apiClient.get('/articles', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            throw error;
        }
    },

    /**
     * Get single article by slug
     * @param {string} slug - Article slug
     * @returns {Promise} API response
     */
    getArticle: async (slug) => {
        try {
            const response = await apiClient.get(`/articles/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch article ${slug}:`, error);
            throw error;
        }
    },

    /**
     * Get enhanced version of article
     * @param {string} slug - Article slug
     * @returns {Promise} API response
     */
    getEnhancedArticle: async (slug) => {
        try {
            const response = await apiClient.get(`/articles/${slug}/enhanced`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch enhanced article ${slug}:`, error);
            throw error;
        }
    }
};

export default apiClient;
