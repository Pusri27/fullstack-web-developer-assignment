#!/usr/bin/env node

import EnhancementPipeline from './enhancementPipeline.js';
import CitationFormatter from './citationFormatter.js';

/**
 * Main Entry Point
 * BeyondChats Article Enhancer
 */

async function main() {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        BeyondChats Article Enhancer v1.0.0               ║
║        Powered by Google Gemini LLM                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);

    // Parse command line arguments
    const args = process.argv.slice(2);
    const command = args[0] || 'enhance';

    const pipeline = new EnhancementPipeline();

    try {
        switch (command) {
            case 'test':
                console.log('🧪 Running component tests...\n');
                await pipeline.testComponents();
                break;

            case 'enhance':
                const limit = parseInt(args[1]) || 5;
                console.log(`📝 Enhancing up to ${limit} articles...\n`);

                const results = await pipeline.run({ limit });

                // Show citation formatting example if articles were enhanced
                if (results.enhanced > 0 && results.articles.length > 0) {
                    const firstEnhanced = results.articles.find(a => a.status === 'enhanced');
                    if (firstEnhanced && firstEnhanced.enhanced.citations) {
                        console.log('\n📚 Citation Formatting Example:');
                        console.log('='.repeat(50));
                        console.log(CitationFormatter.formatMarkdown(firstEnhanced.enhanced.citations));
                    }
                }
                break;

            case 'help':
            default:
                printHelp();
                break;
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    }
}

/**
 * Print help information
 */
function printHelp() {
    console.log(`
Usage: npm start [command] [options]

Commands:
  enhance [limit]    Enhance articles (default: 5)
  test              Test all components
  help              Show this help message

Examples:
  npm start                  # Enhance 5 articles
  npm start enhance 10       # Enhance 10 articles
  npm start test             # Test components

Environment Variables:
  API_BASE_URL              Laravel backend API URL
  GEMINI_API_KEY            Google Gemini API key

For more information, see README.md
  `);
}

// Run main function
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
