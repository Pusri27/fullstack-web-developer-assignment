<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // No authentication required for now
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $articleId = $this->route('article')->id;
        
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('articles', 'slug')->ignore($articleId)],
            'url' => ['sometimes', 'url', 'max:500', Rule::unique('articles', 'url')->ignore($articleId)],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'content' => ['sometimes', 'string'],
            'enhanced_content' => ['nullable', 'string'],
            'author' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'url', 'max:500'],
            'published_at' => ['nullable', 'date'],
            'metadata' => ['nullable', 'array'],
            'metadata.read_time' => ['nullable', 'integer', 'min:1'],
            'metadata.views' => ['nullable', 'integer', 'min:0'],
            'metadata.category' => ['nullable', 'string', 'max:100'],
            'citations' => ['nullable', 'array'],
            'citations.*' => ['nullable', 'url'],
            'is_enhanced' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'slug.unique' => 'This slug is already taken',
            'url.unique' => 'This URL is already registered',
        ];
    }
}
