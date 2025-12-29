<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Article API Routes
|--------------------------------------------------------------------------
*/

// Public routes - no authentication required
Route::prefix('articles')->group(function () {
    // List all articles
    Route::get('/', [ArticleController::class, 'index']);
    
    // Get single article by slug
    Route::get('/{article:slug}', [ArticleController::class, 'show']);
    
    // Create new article
    Route::post('/', [ArticleController::class, 'store']);
    
    // Update article
    Route::put('/{article:slug}', [ArticleController::class, 'update']);
    
    // Delete article
    Route::delete('/{article:slug}', [ArticleController::class, 'destroy']);
    
    // Get enhanced version of article
    Route::get('/{article:slug}/enhanced', [ArticleController::class, 'showEnhanced']);
});
