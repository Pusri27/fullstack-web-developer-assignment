import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Article Enhancer using Google Gemini LLM
 * Enhances articles based on top-ranking content
 */
class ArticleEnhancer {
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.GEMINI_API_KEY;

        if (!this.apiKey) {
            throw new Error('GEMINI_API_KEY is required');
        }

        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    /**
     * Enhance article content using LLM
     * @param {Object} originalArticle - Original article object
     * @param {Array} topRankingArticles - Array of top-ranking article contents
     * @returns {Promise<Object>} Enhanced article with citations
     */
    async enhance(originalArticle, topRankingArticles) {
        try {
            console.log(`🤖 Enhancing article: "${originalArticle.title}"`);

            // Build context from top-ranking articles
            const context = this.buildContext(topRankingArticles);

            // Create enhancement prompt
            const prompt = this.createEnhancementPrompt(
                originalArticle.title,
                originalArticle.content,
                context
            );

            // Generate enhanced content
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const enhancedContent = response.text();

            console.log(`✅ Enhanced content generated (${enhancedContent.length} chars)`);

            return {
                enhancedContent,
                citations: topRankingArticles.map(article => article.url),
                enhancedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Enhancement failed:', error.message);
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
     * Test LLM connection
     * @returns {Promise<boolean>} True if connection successful
     */
    async testConnection() {
        try {
            console.log('🔌 Testing Gemini LLM connection...');

            const result = await this.model.generateContent('Say "Hello, I am working!"');
            const response = await result.response;
            const text = response.text();

            console.log('✅ LLM connection successful:', text);
            return true;

        } catch (error) {
            console.error('❌ LLM connection failed:', error.message);
            return false;
        }
    }
}

export default ArticleEnhancer;
