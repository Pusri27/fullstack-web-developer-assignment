<?php

namespace App\Services;

use App\Models\Article;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class BeyondChatsScraper
{
    private const BASE_URL = 'https://www.beyondchats.com/blogs';
    
    /**
     * Scrape the 5 oldest articles from BeyondChats blog
     */
    public function scrapeOldestArticles(int $count = 5): array
    {
        $articles = [];
        
        try {
            // First, get the last page to find oldest articles
            $lastPage = $this->getLastPage();
            
            // Fetch articles from the last page
            $oldestArticles = $this->fetchArticlesFromPage($lastPage);
            
            // Take only the required count
            $articlesToScrape = array_slice($oldestArticles, 0, $count);
            
            foreach ($articlesToScrape as $articleData) {
                $article = $this->scrapeArticleDetails($articleData);
                
                if ($article) {
                    $articles[] = $article;
                }
            }
            
        } catch (\Exception $e) {
            \Log::error('Scraping failed: ' . $e->getMessage());
        }
        
        return $articles;
    }
    
    /**
     * Get the last page number
     */
    private function getLastPage(): int
    {
        $response = Http::get(self::BASE_URL);
        
        if (!$response->successful()) {
            throw new \Exception('Failed to fetch blog page');
        }
        
        $html = $response->body();
        
        // Parse HTML to find pagination
        // This is a simplified version - in real scenario, use DOMDocument or similar
        preg_match_all('/page=(\d+)/', $html, $matches);
        
        if (empty($matches[1])) {
            return 1;
        }
        
        return max($matches[1]);
    }
    
    /**
     * Fetch articles from a specific page
     */
    private function fetchArticlesFromPage(int $page): array
    {
        $url = self::BASE_URL . '?page=' . $page;
        $response = Http::get($url);
        
        if (!$response->successful()) {
            return [];
        }
        
        $html = $response->body();
        
        // Parse articles from HTML
        // This is simplified - real implementation would use proper HTML parser
        $articles = $this->parseArticlesFromHtml($html);
        
        return $articles;
    }
    
    /**
     * Parse articles from HTML content
     */
    private function parseArticlesFromHtml(string $html): array
    {
        $articles = [];
        
        // Use DOMDocument for proper HTML parsing
        $dom = new \DOMDocument();
        @$dom->loadHTML($html);
        
        // Find article elements (adjust selectors based on actual HTML structure)
        $xpath = new \DOMXPath($dom);
        
        // This is a placeholder - actual selectors need to match BeyondChats structure
        $articleNodes = $xpath->query('//article | //div[contains(@class, "blog-post")]');
        
        foreach ($articleNodes as $node) {
            $article = $this->extractArticleData($node, $xpath);
            if ($article) {
                $articles[] = $article;
            }
        }
        
        return $articles;
    }
    
    /**
     * Extract article data from DOM node
     */
    private function extractArticleData(\DOMNode $node, \DOMXPath $xpath): ?array
    {
        try {
            // Extract title
            $titleNode = $xpath->query('.//h2 | .//h3 | .//a', $node)->item(0);
            $title = $titleNode ? trim($titleNode->textContent) : null;
            
            // Extract URL
            $linkNode = $xpath->query('.//a[@href]', $node)->item(0);
            $url = $linkNode ? $linkNode->getAttribute('href') : null;
            
            if (!$title || !$url) {
                return null;
            }
            
            // Make URL absolute if relative
            if (!str_starts_with($url, 'http')) {
                $url = 'https://www.beyondchats.com' . $url;
            }
            
            return [
                'title' => $title,
                'url' => $url,
            ];
            
        } catch (\Exception $e) {
            return null;
        }
    }
    
    /**
     * Scrape full article details from article URL
     */
    private function scrapeArticleDetails(array $articleData): ?Article
    {
        try {
            $response = Http::get($articleData['url']);
            
            if (!$response->successful()) {
                return null;
            }
            
            $html = $response->body();
            $dom = new \DOMDocument();
            @$dom->loadHTML($html);
            $xpath = new \DOMXPath($dom);
            
            // Extract content (adjust selectors based on actual structure)
            $contentNode = $xpath->query('//article//div[contains(@class, "content")] | //main')->item(0);
            $content = $contentNode ? $this->getNodeContent($contentNode) : '';
            
            // Extract excerpt
            $excerptNode = $xpath->query('//meta[@name="description"]/@content')->item(0);
            $excerpt = $excerptNode ? $excerptNode->textContent : Str::limit($content, 200);
            
            // Extract author
            $authorNode = $xpath->query('//meta[@name="author"]/@content | //span[contains(@class, "author")]')->item(0);
            $author = $authorNode ? $authorNode->textContent : 'BeyondChats';
            
            // Extract image
            $imageNode = $xpath->query('//meta[@property="og:image"]/@content | //article//img/@src')->item(0);
            $imageUrl = $imageNode ? $imageNode->textContent : null;
            
            // Create or update article
            $article = Article::updateOrCreate(
                ['url' => $articleData['url']],
                [
                    'title' => $articleData['title'],
                    'slug' => Str::slug($articleData['title']),
                    'excerpt' => $excerpt,
                    'content' => $content,
                    'author' => $author,
                    'image_url' => $imageUrl,
                    'published_at' => now(),
                    'metadata' => [
                        'source' => 'beyondchats',
                        'scraped_at' => now()->toIso8601String(),
                    ],
                ]
            );
            
            return $article;
            
        } catch (\Exception $e) {
            \Log::error('Failed to scrape article: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Get text content from DOM node
     */
    private function getNodeContent(\DOMNode $node): string
    {
        $content = '';
        
        foreach ($node->childNodes as $child) {
            if ($child->nodeType === XML_TEXT_NODE) {
                $content .= $child->textContent;
            } elseif ($child->nodeType === XML_ELEMENT_NODE) {
                $content .= $this->getNodeContent($child);
            }
        }
        
        return trim($content);
    }
}
