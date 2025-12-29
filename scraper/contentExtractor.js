import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Content Extractor
 * Extracts main content from article URLs
 */
class ContentExtractor {
    constructor() {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }

    /**
     * Extract content from a URL
     * @param {string} url - Article URL
     * @returns {Promise<Object>} Extracted content object
     */
    async extract(url) {
        try {
            console.log(`📄 Extracting content from: ${url}`);

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                },
                timeout: 10000 // 10 second timeout
            });

            const $ = cheerio.load(response.data);

            // Extract metadata
            const title = this.extractTitle($);
            const content = this.extractMainContent($);
            const author = this.extractAuthor($);
            const publishedDate = this.extractPublishedDate($);

            console.log(`✅ Extracted: "${title}" (${content.length} chars)`);

            return {
                url,
                title,
                content,
                author,
                publishedDate,
                extractedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error(`❌ Failed to extract from ${url}:`, error.message);
            return null;
        }
    }

    /**
     * Extract title from page
     * @param {CheerioAPI} $ - Cheerio instance
     * @returns {string} Page title
     */
    extractTitle($) {
        // Try multiple selectors
        const selectors = [
            'meta[property="og:title"]',
            'meta[name="twitter:title"]',
            'h1',
            'title'
        ];

        for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length) {
                const title = selector.includes('meta')
                    ? element.attr('content')
                    : element.text();

                if (title && title.trim()) {
                    return title.trim();
                }
            }
        }

        return 'Untitled';
    }

    /**
     * Extract main content from page
     * @param {CheerioAPI} $ - Cheerio instance
     * @returns {string} Main content text
     */
    extractMainContent($) {
        // Remove unwanted elements
        $('script, style, nav, header, footer, aside, .advertisement, .ads, .sidebar, .comments').remove();

        // Try to find main content area
        const contentSelectors = [
            'article',
            'main',
            '[role="main"]',
            '.post-content',
            '.article-content',
            '.entry-content',
            '.content',
            '#content',
            '.post-body',
            '.article-body'
        ];

        for (const selector of contentSelectors) {
            const element = $(selector).first();
            if (element.length) {
                const text = element.text().trim();
                if (text.length > 200) { // Minimum content length
                    return this.cleanText(text);
                }
            }
        }

        // Fallback: get body text
        const bodyText = $('body').text().trim();
        return this.cleanText(bodyText);
    }

    /**
     * Extract author from page
     * @param {CheerioAPI} $ - Cheerio instance
     * @returns {string|null} Author name
     */
    extractAuthor($) {
        const selectors = [
            'meta[name="author"]',
            'meta[property="article:author"]',
            '.author',
            '.by-author',
            '[rel="author"]',
            '.post-author'
        ];

        for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length) {
                const author = selector.includes('meta')
                    ? element.attr('content')
                    : element.text();

                if (author && author.trim()) {
                    return author.trim();
                }
            }
        }

        return null;
    }

    /**
     * Extract published date from page
     * @param {CheerioAPI} $ - Cheerio instance
     * @returns {string|null} Published date
     */
    extractPublishedDate($) {
        const selectors = [
            'meta[property="article:published_time"]',
            'meta[name="publish_date"]',
            'time[datetime]',
            '.published-date',
            '.post-date'
        ];

        for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length) {
                const date = selector.includes('meta')
                    ? element.attr('content')
                    : (element.attr('datetime') || element.text());

                if (date && date.trim()) {
                    return date.trim();
                }
            }
        }

        return null;
    }

    /**
     * Clean and normalize text
     * @param {string} text - Raw text
     * @returns {string} Cleaned text
     */
    cleanText(text) {
        return text
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
            .trim();
    }

    /**
     * Extract content from multiple URLs
     * @param {Array<string>} urls - Array of URLs
     * @returns {Promise<Array>} Array of extracted content
     */
    async extractMultiple(urls) {
        const results = [];

        for (const url of urls) {
            const content = await this.extract(url);
            if (content) {
                results.push(content);
            }

            // Add delay to avoid rate limiting
            await this.delay(1000);
        }

        return results;
    }

    /**
     * Delay helper
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default ContentExtractor;
