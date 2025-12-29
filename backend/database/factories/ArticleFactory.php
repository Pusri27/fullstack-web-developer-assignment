<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(6, true);
        
        return [
            'title' => $title,
            'slug' => fake()->unique()->slug(),
            'url' => fake()->url(),
            'excerpt' => fake()->paragraph(2),
            'content' => fake()->paragraphs(10, true),
            'enhanced_content' => null,
            'author' => fake()->name(),
            'image_url' => fake()->imageUrl(1200, 630, 'business', true),
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'metadata' => [
                'read_time' => fake()->numberBetween(3, 15),
                'views' => fake()->numberBetween(100, 10000),
                'category' => fake()->randomElement(['Technology', 'Business', 'AI', 'Marketing']),
            ],
            'citations' => null,
            'is_enhanced' => false,
        ];
    }
}
