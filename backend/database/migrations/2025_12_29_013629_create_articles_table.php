<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('url')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->longText('enhanced_content')->nullable();
            $table->string('author')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->json('metadata')->nullable();
            $table->json('citations')->nullable();
            $table->boolean('is_enhanced')->default(false);
            $table->timestamps();
            
            // Indexes for better query performance
            $table->index('published_at');
            $table->index('is_enhanced');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
