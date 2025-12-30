import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Article Enhancer using OpenRouter API
 * Enhances articles based on top-ranking content
 * Supports multiple LLM models via OpenRouter
 */
class ArticleEnhancer {
    constructor(apiKey, model) {
        this.apiKey = apiKey || process.env.OPENROUTER_API_KEY;
        this.model = model || process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free';

        if (!this.apiKey) {
            throw new Error('OPENROUTER_API_KEY is required');
        }

        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    }

    /**
     * Enhance article content using LLM via OpenRouter
     * @param {Object} originalArticle - Original article object
     * @param {Array} topRankingArticles - Array of top-ranking article contents
     * @returns {Promise<Object>} Enhanced article with citations
     */
    async enhance(originalArticle, topRankingArticles) {
        try {
            console.log(`🤖 Enhancing article: "${originalArticle.title}"`);
            console.log(`📡 Using model: ${this.model}`);

            // Build context from top-ranking articles
            const context = this.buildContext(topRankingArticles);

            // Create enhancement prompt
            const prompt = this.createEnhancementPrompt(
                originalArticle.title,
                originalArticle.content,
                context
            );

            // Call OpenRouter API
            const response = await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 4000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://github.com/Pusri27/fullstack-web-developer-assignment',
                        'X-Title': 'BeyondChats Article Enhancer'
                    }
                }
            );

            const enhancedContent = response.data.choices[0].message.content;

            console.log(`✅ Enhanced content generated (${enhancedContent.length} chars)`);
            console.log(`💰 Tokens used: ${response.data.usage?.total_tokens || 'N/A'}`);

            return {
                enhancedContent,
                citations: topRankingArticles.map(article => article.url),
                enhancedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Enhancement failed:', error.message);
            if (error.response) {
                console.error('API Error:', error.response.data);
            }
            throw error;
        }
    }

    /**
     * Build context from top-ranking articles
     * @param {Array} articles - Array of article objects
     * @returns {string} Context string
     */
    buildContext(articles) {
        let context = '';

        articles.forEach((article, index) => {
            context += `\n--- Top Ranking Article ${index + 1} ---\n`;
            context += `Title: ${article.title}\n`;
            context += `Content: ${article.content.substring(0, 2000)}...\n`;
            context += `URL: ${article.url}\n`;
        });

        return context;
    }

    /**
     * Create enhancement prompt for LLM
     * @param {string} title - Original article title
     * @param {string} content - Original article content
     * @param {string} context - Context from top-ranking articles
     * @returns {string} Prompt for LLM
     */
    createEnhancementPrompt(title, content, context) {
        return `You are an expert content writer tasked with enhancing a blog article.

ORIGINAL ARTICLE:
Title: ${title}
Content: ${content}

TOP-RANKING ARTICLES FOR REFERENCE:
${context}

TASK:
Enhance the original article by:
1. Improving the writing quality, clarity, and readability
2. Incorporating insights and best practices from the top-ranking articles
3. Maintaining the original article's core message and intent
4. Using a professional, engaging tone
5. Ensuring proper formatting with clear paragraphs
6. Adding relevant examples or explanations where appropriate
7. Making it more comprehensive and valuable to readers

IMPORTANT GUIDELINES:
- Do NOT plagiarize from the reference articles
- Use the reference articles only for inspiration and to understand what makes content rank well
- Keep the enhanced content focused on the original topic
- Aim for approximately ${Math.max(content.length * 1.5, 1000)} characters
- Write in a clear, professional style
- Use markdown formatting for better readability

OUTPUT:
Provide ONLY the enhanced article content without any preamble or explanation.`;
    }

    /**
     * Enhance multiple articles
     * @param {Array} articles - Array of article objects with topRankingContent
     * @returns {Promise<Array>} Array of enhanced articles
     */
    async enhanceMultiple(articles) {
        const enhanced = [];

        for (const article of articles) {
            try {
                const result = await this.enhance(
                    article.original,
                    article.topRankingContent
                );

                enhanced.push({
                    ...article.original,
                    ...result
                });

                // Add delay to respect rate limits
                await this.delay(2000);

            } catch (error) {
                console.error(`Failed to enhance "${article.original.title}":`, error.message);
            }
        }

        return enhanced;
    }

    /**
     * Delay helper
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Test OpenRouter API connection
     * @returns {Promise<boolean>} True if connection successful
     */
    async testConnection() {
        try {
            console.log('🔌 Testing OpenRouter API connection...');
            console.log(`📡 Model: ${this.model}`);

            const response = await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: 'Say "Hello, I am working!"'
                        }
                    ],
                    max_tokens: 50
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://github.com/Pusri27/fullstack-web-developer-assignment',
                        'X-Title': 'BeyondChats Article Enhancer'
                    }
                }
            );

            const text = response.data.choices[0].message.content;

            console.log('✅ OpenRouter API connection successful:', text);
            console.log(`💰 Tokens used: ${response.data.usage?.total_tokens || 'N/A'}`);
            return true;

        } catch (error) {
            console.error('❌ OpenRouter API connection failed:', error.message);
            if (error.response) {
                console.error('API Error:', error.response.data);
            }
            return false;
        }
    }
}

export default ArticleEnhancer;
