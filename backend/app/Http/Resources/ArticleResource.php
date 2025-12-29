<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'url' => $this->url,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'enhanced_content' => $this->when($this->is_enhanced, $this->enhanced_content),
            'author' => $this->author,
            'image_url' => $this->image_url,
            'published_at' => $this->published_at?->toIso8601String(),
            'metadata' => $this->metadata,
            'citations' => $this->when($this->is_enhanced, $this->citations),
            'is_enhanced' => $this->is_enhanced,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            
            // Links
            'links' => [
                'self' => route('articles.show', ['article' => $this->slug]),
                'enhanced' => $this->when(
                    $this->is_enhanced,
                    route('articles.enhanced', ['article' => $this->slug])
                ),
            ],
        ];
    }
}
