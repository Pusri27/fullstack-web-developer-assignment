# OpenRouter Setup Guide

## Why OpenRouter?

OpenRouter provides access to multiple LLM models through a single API, including:
- ✅ **Free models** (Gemini 2.0 Flash)
- ✅ Multiple providers (Google, OpenAI, Anthropic, Meta)
- ✅ Simple API
- ✅ Pay-as-you-go pricing
- ✅ No credit card required for free tier

---

## Setup Steps

### 1. Create OpenRouter Account

1. Go to https://openrouter.ai
2. Click "Sign In" (top right)
3. Sign in with Google/GitHub
4. Free account - no credit card needed!

### 2. Get API Key

1. After login, go to https://openrouter.ai/keys
2. Click "Create Key"
3. Name it: `BeyondChats Article Enhancer`
4. Copy the API key (starts with `sk-or-v1-...`)

### 3. Configure Scraper

Edit `scraper/.env`:

```bash
# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Model (optional - defaults to free Gemini)
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

### 4. Install Dependencies

```bash
cd scraper
npm install
```

### 5. Test Connection

```bash
npm start test
```

Should see:
```
✅ OpenRouter API connection successful: Hello, I am working!
```

---

## Available Models

### Free Models (No Credit Card)
- `google/gemini-2.0-flash-exp:free` ⭐ **Recommended**
- `google/gemini-pro-1.5-exp:free`
- `meta-llama/llama-3.2-3b-instruct:free`

### Paid Models (Better Quality)
- `google/gemini-pro` - $0.00025/1K tokens
- `anthropic/claude-3.5-sonnet` - $0.003/1K tokens
- `openai/gpt-4-turbo` - $0.01/1K tokens

See all models: https://openrouter.ai/models

---

## Usage

### Basic Enhancement
```bash
npm start
# Enhances 5 articles by default
```

### Custom Number
```bash
npm start enhance 10
# Enhances 10 articles
```

### Test Only
```bash
npm start test
# Tests API connection
```

---

## Cost Estimation

### Free Tier (Gemini 2.0 Flash)
- ✅ Completely FREE
- ✅ Rate limit: ~10 requests/minute
- ✅ Perfect for development/testing
- ✅ Good quality for article enhancement

### Example with Paid Model
If using `google/gemini-pro`:
- Average article: ~2,000 tokens
- Cost per article: ~$0.0005 (0.05 cents)
- 100 articles: ~$0.05 (5 cents)
- Very affordable! 💰

---

## Troubleshooting

### Error: "Invalid API Key"
- Check your API key in `.env`
- Make sure it starts with `sk-or-v1-`
- No spaces before/after the key

### Error: "Rate limit exceeded"
- Free tier has rate limits
- Wait 1 minute and try again
- Or add delay between requests

### Error: "Model not found"
- Check model name is correct
- See available models: https://openrouter.ai/models
- Use free model: `google/gemini-2.0-flash-exp:free`

### Slow Response
- Free models may be slower
- Consider upgrading to paid model
- Or use smaller batch sizes

---

## Tips

### 1. Start with Free Model
```bash
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

### 2. Monitor Usage
- Check dashboard: https://openrouter.ai/activity
- See token usage and costs
- Set spending limits

### 3. Optimize Prompts
- Shorter prompts = lower cost
- Clear instructions = better results
- Test with 1-2 articles first

### 4. Batch Processing
```javascript
// In enhancementPipeline.js
const results = await pipeline.run({ 
  limit: 5  // Start small
});
```

---

## Comparison: OpenRouter vs Google Gemini Direct

| Feature | OpenRouter | Google Gemini Direct |
|---------|-----------|---------------------|
| Setup | Easy (1 API key) | Complex (Google Cloud) |
| Free Tier | ✅ Yes | ✅ Yes |
| Multiple Models | ✅ Yes | ❌ No |
| Billing | Simple | Complex |
| Rate Limits | Generous | Strict |
| **Recommended** | ⭐ **YES** | For production only |

---

## Next Steps

1. ✅ Get OpenRouter API key
2. ✅ Add to `.env`
3. ✅ Test connection
4. ✅ Enhance articles!

---

## Support

- **OpenRouter Docs**: https://openrouter.ai/docs
- **Discord**: https://discord.gg/openrouter
- **Status**: https://status.openrouter.ai

---

**Happy Enhancing! 🚀**
