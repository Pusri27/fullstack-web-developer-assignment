<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ScrapeArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scrape:beyondchats {--count=5 : Number of articles to scrape}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape the oldest articles from BeyondChats blog';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to scrape BeyondChats blog articles...');
        
        $scraper = new \App\Services\BeyondChatsScraper();
        
        $this->info('Fetching the 5 oldest articles from BeyondChats...');
        
        $articles = $scraper->scrapeOldestArticles(5);
        
        if (empty($articles)) {
            $this->error('No articles were scraped!');
            return 1;
        }
        
        $this->info('Successfully scraped ' . count($articles) . ' articles:');
        
        foreach ($articles as $article) {
            $this->line('  - ' . $article->title);
        }
        
        $this->newLine();
        $this->info('✓ Scraping completed successfully!');
        
        return 0;
    }
}
