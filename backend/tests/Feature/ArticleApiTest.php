<?php

namespace Tests\Feature;

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test listing all articles.
     */
    public function test_can_list_articles(): void
    {
        Article::factory()->count(5)->create();

        $response = $this->getJson('/api/articles');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'title', 'slug', 'url', 'content']
                ],
                'meta' => ['total', 'current_page', 'total_pages'],
                'links' => ['first', 'last', 'prev', 'next']
            ]);
    }

    /**
     * Test creating an article.
     */
    public function test_can_create_article(): void
    {
        $articleData = [
            'title' => 'Test Article',
            'slug' => 'test-article',
            'url' => 'https://example.com/test-article',
            'content' => 'This is test content.',
            'excerpt' => 'Test excerpt',
            'author' => 'Test Author',
        ];

        $response = $this->postJson('/api/articles', $articleData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Article created successfully'
            ]);

        $this->assertDatabaseHas('articles', [
            'title' => 'Test Article',
            'slug' => 'test-article',
        ]);
    }

    /**
     * Test validation when creating article.
     */
    public function test_article_creation_requires_title(): void
    {
        $response = $this->postJson('/api/articles', [
            'slug' => 'test-slug',
            'url' => 'https://example.com/test',
            'content' => 'Test content',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    /**
     * Test showing a single article.
     */
    public function test_can_show_single_article(): void
    {
        $article = Article::factory()->create();

        $response = $this->getJson("/api/articles/{$article->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $article->id,
                    'title' => $article->title,
                    'slug' => $article->slug,
                ]
            ]);
    }

    /**
     * Test updating an article.
     */
    public function test_can_update_article(): void
    {
        $article = Article::factory()->create();

        $updateData = [
            'title' => 'Updated Title',
            'content' => 'Updated content',
        ];

        $response = $this->putJson("/api/articles/{$article->slug}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Article updated successfully'
            ]);

        $this->assertDatabaseHas('articles', [
            'id' => $article->id,
            'title' => 'Updated Title',
        ]);
    }

    /**
     * Test deleting an article.
     */
    public function test_can_delete_article(): void
    {
        $article = Article::factory()->create();

        $response = $this->deleteJson("/api/articles/{$article->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Article deleted successfully'
            ]);

        $this->assertDatabaseMissing('articles', [
            'id' => $article->id,
        ]);
    }

    /**
     * Test filtering articles by enhanced status.
     */
    public function test_can_filter_articles_by_enhanced_status(): void
    {
        Article::factory()->count(3)->create(['is_enhanced' => false]);
        Article::factory()->count(2)->create(['is_enhanced' => true]);

        $response = $this->getJson('/api/articles?is_enhanced=1');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(2, $data);
    }

    /**
     * Test searching articles by title.
     */
    public function test_can_search_articles_by_title(): void
    {
        Article::factory()->create(['title' => 'Laravel Testing Guide']);
        Article::factory()->create(['title' => 'PHP Best Practices']);

        $response = $this->getJson('/api/articles?search=Laravel');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Laravel Testing Guide', $data[0]['title']);
    }

    /**
     * Test getting enhanced version of article.
     */
    public function test_can_get_enhanced_article(): void
    {
        $article = Article::factory()->create([
            'is_enhanced' => true,
            'enhanced_content' => 'Enhanced content here',
            'citations' => ['https://example.com/source1']
        ]);

        $response = $this->getJson("/api/articles/{$article->slug}/enhanced");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'enhanced_content' => 'Enhanced content here',
                    'citations' => ['https://example.com/source1']
                ]
            ]);
    }

    /**
     * Test enhanced endpoint returns 404 for non-enhanced article.
     */
    public function test_enhanced_endpoint_returns_404_for_non_enhanced_article(): void
    {
        $article = Article::factory()->create(['is_enhanced' => false]);

        $response = $this->getJson("/api/articles/{$article->slug}/enhanced");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Enhanced version not available for this article'
            ]);
    }

    /**
     * Test pagination works correctly.
     */
    public function test_pagination_works_correctly(): void
    {
        Article::factory()->count(25)->create();

        $response = $this->getJson('/api/articles?per_page=10');

        $response->assertStatus(200);
        $meta = $response->json('meta');
        
        $this->assertEquals(10, $meta['per_page']);
        $this->assertEquals(25, $meta['total']);
        $this->assertEquals(3, $meta['total_pages']);
    }
}
