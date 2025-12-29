import dotenv from 'dotenv';
import ApiClient from './apiClient.js';
import GoogleSearcher from './googleSearcher.js';
import ContentExtractor from './contentExtractor.js';
import ArticleEnhancer from './articleEnhancer.js';

dotenv.config();

/**
 * Enhancement Pipeline
 * Orchestrates the entire article enhancement process
 */
class EnhancementPipeline {
    constructor() {
        this.apiClient = new ApiClient();
        this.googleSearcher = new GoogleSearcher();
        this.contentExtractor = new ContentExtractor();
        this.articleEnhancer = new ArticleEnhancer();
    }

    /**
     * Run the complete enhancement pipeline
     * @param {Object} options - Pipeline options
     * @returns {Promise<Object>} Pipeline results
     */
    async run(options = {}) {
        const {
            limit = 5,
            skipEnhanced = true
        } = options;

        console.log('\n🚀 Starting Article Enhancement Pipeline\n');
        console.log('='.repeat(50));

        const results = {
            total: 0,
            enhanced: 0,
            failed: 0,
            skipped: 0,
            articles: []
        };

        try {
            // Step 1: Fetch articles from API
            console.log('\n📥 Step 1: Fetching articles from API...');
            const articles = skipEnhanced
                ? await this.apiClient.getNonEnhancedArticles()
                : await this.apiClient.getArticles();

            results.total = Math.min(articles.length, limit);
            console.log(`✅ Found ${articles.length} articles (processing ${results.total})`);

            if (articles.length === 0) {
                console.log('⚠️  No articles to enhance');
                return results;
            }

            // Process articles
            const articlesToProcess = articles.slice(0, limit);

            for (let i = 0; i < articlesToProcess.length; i++) {
                const article = articlesToProcess[i];
                console.log(`\n${'='.repeat(50)}`);
                console.log(`📝 Processing Article ${i + 1}/${results.total}`);
                console.log(`Title: "${article.title}"`);
                console.log(`${'='.repeat(50)}`);

                try {
                    const enhanced = await this.enhanceArticle(article);
                    results.enhanced++;
                    results.articles.push({
                        slug: article.slug,
                        title: article.title,
                        status: 'enhanced',
                        enhanced
                    });

                } catch (error) {
                    console.error(`❌ Failed to enhance article:`, error.message);
                    results.failed++;
                    results.articles.push({
                        slug: article.slug,
                        title: article.title,
                        status: 'failed',
                        error: error.message
                    });
                }
            }

            // Print summary
            this.printSummary(results);

            return results;

        } catch (error) {
            console.error('\n❌ Pipeline failed:', error.message);
            throw error;
        }
    }

    /**
     * Enhance a single article
     * @param {Object} article - Article object from API
     * @returns {Promise<Object>} Enhanced article
     */
    async enhanceArticle(article) {
        // Step 2: Google Search for article title
        console.log('\n🔍 Step 2: Searching Google for top-ranking articles...');
        const searchResults = await this.googleSearcher.searchArticles(article.title, 2);

        if (searchResults.length === 0) {
            throw new Error('No search results found');
        }

        console.log(`✅ Found ${searchResults.length} top-ranking URLs`);
        searchResults.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));

        // Step 3: Extract content from top-ranking articles
        console.log('\n📄 Step 3: Extracting content from top-ranking articles...');
        const extractedContent = await this.contentExtractor.extractMultiple(searchResults);

        if (extractedContent.length === 0) {
            throw new Error('Failed to extract content from search results');
        }

        console.log(`✅ Extracted content from ${extractedContent.length} articles`);

        // Step 4: Enhance article using LLM
        console.log('\n🤖 Step 4: Enhancing article with Gemini LLM...');
        const enhancement = await this.articleEnhancer.enhance(
            {
                title: article.title,
                content: article.content
            },
            extractedContent
        );

        // Step 5: Update article in database
        console.log('\n💾 Step 5: Updating article in database...');
        const updated = await this.apiClient.updateArticle(article.slug, {
            enhanced_content: enhancement.enhancedContent,
            citations: enhancement.citations,
            is_enhanced: true
        });

        console.log('✅ Article updated successfully');

        return {
            originalLength: article.content.length,
            enhancedLength: enhancement.enhancedContent.length,
            citationsCount: enhancement.citations.length,
            citations: enhancement.citations
        };
    }

    /**
     * Print pipeline summary
     * @param {Object} results - Pipeline results
     */
    printSummary(results) {
        console.log('\n' + '='.repeat(50));
        console.log('📊 PIPELINE SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total Articles: ${results.total}`);
        console.log(`✅ Enhanced: ${results.enhanced}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log(`⏭️  Skipped: ${results.skipped}`);
        console.log('='.repeat(50));

        if (results.enhanced > 0) {
            console.log('\n✨ Successfully Enhanced Articles:');
            results.articles
                .filter(a => a.status === 'enhanced')
                .forEach((article, i) => {
                    console.log(`\n${i + 1}. ${article.title}`);
                    console.log(`   Slug: ${article.slug}`);
                    console.log(`   Citations: ${article.enhanced.citationsCount}`);
                    console.log(`   Length: ${article.enhanced.originalLength} → ${article.enhanced.enhancedLength} chars`);
                });
        }

        if (results.failed > 0) {
            console.log('\n⚠️  Failed Articles:');
            results.articles
                .filter(a => a.status === 'failed')
                .forEach((article, i) => {
                    console.log(`\n${i + 1}. ${article.title}`);
                    console.log(`   Error: ${article.error}`);
                });
        }

        console.log('\n🎉 Pipeline completed!\n');
    }

    /**
     * Test all components
     * @returns {Promise<boolean>} True if all tests pass
     */
    async testComponents() {
        console.log('\n🧪 Testing Pipeline Components\n');
        console.log('='.repeat(50));

        const tests = [
            {
                name: 'API Client',
                test: async () => {
                    const articles = await this.apiClient.getArticles({ per_page: 1 });
                    return articles.length >= 0;
                }
            },
            {
                name: 'Google Searcher',
                test: async () => {
                    const results = await this.googleSearcher.search('test query', 1);
                    return true; // Even empty results are OK for test
                }
            },
            {
                name: 'Gemini LLM',
                test: async () => {
                    return await this.articleEnhancer.testConnection();
                }
            }
        ];

        let allPassed = true;

        for (const test of tests) {
            try {
                console.log(`\nTesting ${test.name}...`);
                const result = await test.test();
                if (result) {
                    console.log(`✅ ${test.name}: PASSED`);
                } else {
                    console.log(`❌ ${test.name}: FAILED`);
                    allPassed = false;
                }
            } catch (error) {
                console.log(`❌ ${test.name}: ERROR - ${error.message}`);
                allPassed = false;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed');
        console.log('='.repeat(50) + '\n');

        return allPassed;
    }
}

export default EnhancementPipeline;
