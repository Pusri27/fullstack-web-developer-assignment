<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Article::query();
        
        // Filter by enhanced status
        if ($request->has('is_enhanced')) {
            $query->where('is_enhanced', $request->boolean('is_enhanced'));
        }
        
        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        
        // Sort
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        // Paginate
        $perPage = $request->get('per_page', 15);
        $articles = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $articles->items(),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'total_pages' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
                'from' => $articles->firstItem(),
                'to' => $articles->lastItem(),
            ],
            'links' => [
                'first' => $articles->url(1),
                'last' => $articles->url($articles->lastPage()),
                'prev' => $articles->previousPageUrl(),
                'next' => $articles->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Store a newly created article.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:articles,slug',
            'url' => 'required|url|unique:articles,url',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'enhanced_content' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'image_url' => 'nullable|url',
            'published_at' => 'nullable|date',
            'metadata' => 'nullable|array',
            'citations' => 'nullable|array',
            'is_enhanced' => 'nullable|boolean',
        ]);
        
        $article = Article::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Article created successfully',
            'data' => $article,
        ], 201);
    }

    /**
     * Display the specified article.
     */
    public function show(Article $article): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }

    /**
     * Update the specified article.
     */
    public function update(Request $request, Article $article): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:articles,slug,' . $article->id,
            'url' => 'sometimes|url|unique:articles,url,' . $article->id,
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|string',
            'enhanced_content' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'image_url' => 'nullable|url',
            'published_at' => 'nullable|date',
            'metadata' => 'nullable|array',
            'citations' => 'nullable|array',
            'is_enhanced' => 'nullable|boolean',
        ]);
        
        $article->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Article updated successfully',
            'data' => $article->fresh(),
        ]);
    }

    /**
     * Remove the specified article.
     */
    public function destroy(Article $article): JsonResponse
    {
        $article->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully',
        ]);
    }

    /**
     * Get enhanced version of article.
     */
    public function showEnhanced(Article $article): JsonResponse
    {
        if (!$article->is_enhanced || !$article->enhanced_content) {
            return response()->json([
                'success' => false,
                'message' => 'Enhanced version not available for this article',
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'enhanced_content' => $article->enhanced_content,
                'citations' => $article->citations,
                'metadata' => $article->metadata,
                'updated_at' => $article->updated_at,
            ],
        ]);
    }
}
