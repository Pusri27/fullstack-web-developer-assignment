import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Google Search Module
 * Searches Google for article titles and extracts top ranking URLs
 */
class GoogleSearcher {
    constructor() {
        this.baseUrl = 'https://www.google.com/search';
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }

    /**
     * Search Google for a query and return top results
     * @param {string} query - Search query
     * @param {number} numResults - Number of results to return (default: 2)
     * @returns {Promise<Array>} Array of search result URLs
     */
    async search(query, numResults = 2) {
        try {
            console.log(`🔍 Searching Google for: "${query}"`);

            const response = await axios.get(this.baseUrl, {
                params: {
                    q: query,
                    num: 10, // Request more to filter
                },
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                }
            });

            const $ = cheerio.load(response.data);
            const results = [];

            // Extract search result links
            // Google uses different selectors, we'll try multiple
            const selectors = [
                'div.g a[href^="http"]',
                'div.yuRUbf a[href^="http"]',
                'a[href^="http"]'
            ];

            for (const selector of selectors) {
                $(selector).each((i, element) => {
                    const url = $(element).attr('href');

                    // Filter out unwanted URLs
                    if (this.isValidUrl(url) && results.length < numResults) {
                        if (!results.includes(url)) {
                            results.push(url);
                        }
                    }
                });

                if (results.length >= numResults) {
                    break;
                }
            }

            console.log(`✅ Found ${results.length} results`);
            return results.slice(0, numResults);

        } catch (error) {
            console.error('❌ Google search failed:', error.message);
            return [];
        }
    }

    /**
     * Validate if URL is acceptable for scraping
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid
     */
    isValidUrl(url) {
        if (!url) return false;

        // Exclude Google's own URLs and common non-article URLs
        const excludePatterns = [
            'google.com',
            'youtube.com',
            'facebook.com',
            'twitter.com',
            'instagram.com',
            'linkedin.com',
            'reddit.com',
            'pinterest.com',
            'amazon.com',
            'ebay.com',
            'wikipedia.org', // Can be included if needed
            '/search?',
            '/url?',
            'accounts.google',
            'support.google',
            'policies.google',
            'maps.google',
            'news.google',
            'shopping.google'
        ];

        // Check if URL contains any excluded patterns
        for (const pattern of excludePatterns) {
            if (url.toLowerCase().includes(pattern)) {
                return false;
            }
        }

        // Must be HTTP/HTTPS
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return false;
        }

        return true;
    }

    /**
     * Search and filter for blog/article URLs specifically
     * @param {string} query - Search query
     * @param {number} numResults - Number of results
     * @returns {Promise<Array>} Array of article URLs
     */
    async searchArticles(query, numResults = 2) {
        // Add keywords to improve article results
        const enhancedQuery = `${query} blog article`;
        return await this.search(enhancedQuery, numResults);
    }
}

export default GoogleSearcher;
