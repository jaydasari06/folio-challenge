# Setting up Google Gemini API for the Design QA Agent

## Getting your free Gemini API Key

1. **Visit Google AI Studio**: Go to [https://makersuite.google.com/](https://makersuite.google.com/)

2. **Sign in with your Google account**

3. **Get API Key**:
   - Click "Get API key" in the navigation
   - Click "Create API key in new project" (or select an existing project)
   - Copy the generated API key

4. **Add to your .env file**:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Why Gemini instead of OpenAI?

- **Free tier**: Gemini offers a generous free tier with 60 requests per minute
- **No credit card required**: You can start using it immediately
- **Great performance**: Gemini Pro provides excellent results for design analysis

## Free Tier Limits

- 60 requests per minute
- 1,500 requests per day
- Perfect for development and testing!

## Testing the API

After setting up your API key, you can test it by:

1. Installing the new requirements: `pip install -r requirements.txt`
2. Starting the backend: `python backend.py`
3. Testing the endpoint: `curl http://localhost:5001/api/analyze/test`

The AI analysis will now be powered by Google's Gemini model!
