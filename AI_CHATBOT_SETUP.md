# AI Chatbot Setup Guide

## Overview

The AI Helper Chatbot is a smart assistant that helps users navigate the CareShare platform. It appears as a floating button in the bottom-right corner of every page.

## Features

- ✅ **24/7 Availability**: Always ready to help users
- ✅ **Context-Aware**: Understands CareShare-specific features
- ✅ **Smart Responses**: Answers questions about registration, matching, chat, tokens, videos, etc.
- ✅ **Quick Questions**: Predefined questions for instant help
- ✅ **Dark Mode Compatible**: Works seamlessly with light/dark themes
- ✅ **Real-time Chat Interface**: Familiar chat UI with typing indicators
- ✅ **Local Fallback**: Works without external APIs using pattern matching

## How It Works

### Frontend (`AiChatbot.jsx`)

Located in: `frontend/src/components/utils/AiChatbot/AiChatbot.jsx`

**Features:**

- Floating chat button with pulsing AI badge
- Expandable chat window (396px × 600px)
- Message history with user/assistant distinction
- Quick question buttons
- Auto-scroll to latest message
- Loading indicators
- Dark mode support

**Local Intelligence:**
The chatbot has built-in responses for common topics:

- Getting Started
- Registration
- Matching/Swipe
- Chat Features
- Token System
- Skill Videos
- Profile Management
- Troubleshooting
- Dark Mode
- Contact Info

### Backend (`aiChatController.js`)

Located in: `backend/controllers/aiChatController.js`

**Features:**

- Receives user messages and conversation history
- Supports multiple AI API integrations (configurable)
- Falls back to local responses if no API configured
- Error handling and logging

## AI API Integration (Optional)

The chatbot works perfectly with local responses, but you can enhance it with external AI APIs:

### Option 1: OpenAI GPT-4 (Recommended)

**Setup:**

1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Install package:
   ```bash
   cd backend
   npm install openai
   ```
3. Add to `.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Uncomment OpenAI code in `aiChatController.js`:
   ```javascript
   const OpenAI = require("openai");
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });
   ```
   And uncomment the OpenAI section in the `aiChat` function.

**Cost:** ~$0.01-0.03 per conversation (GPT-4 Turbo)

### Option 2: Google Gemini (Free Tier Available)

**Setup:**

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Install package:
   ```bash
   cd backend
   npm install @google/generative-ai
   ```
3. Add to `.env`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Uncomment Gemini code in `aiChatController.js`:
   ```javascript
   const { GoogleGenerativeAI } = require("@google/generative-ai");
   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
   ```
   And uncomment the Gemini section in the `aiChat` function.

**Cost:** Free tier: 60 requests per minute

### Option 3: Hugging Face (Free)

**Setup:**

1. Create account at [Hugging Face](https://huggingface.co/)
2. Get token from [Settings/Tokens](https://huggingface.co/settings/tokens)
3. Add to `.env`:
   ```
   HUGGINGFACE_API_KEY=your_huggingface_token_here
   ```
4. Install axios (if not already):
   ```bash
   npm install axios
   ```
5. Uncomment Hugging Face code in `aiChatController.js`

**Cost:** Free (with rate limits)

### Option 4: Local LLM (Advanced)

For complete privacy, you can run a local LLM:

**Using Ollama:**

1. Install [Ollama](https://ollama.ai/)
2. Run a model:
   ```bash
   ollama run llama2
   ```
3. Use Ollama API in `aiChatController.js`:
   ```javascript
   const response = await fetch("http://localhost:11434/api/generate", {
     method: "POST",
     body: JSON.stringify({
       model: "llama2",
       prompt: message,
       stream: false,
     }),
   });
   ```

## Usage

### For Users

1. **Open Chat**: Click the 🤖 button in bottom-right corner
2. **Ask Questions**: Type any question about CareShare
3. **Quick Questions**: Click predefined questions for instant answers
4. **Close Chat**: Click X in the header

### For Developers

**Customize Responses:**
Edit `generateLocalResponse()` function in `AiChatbot.jsx` to add more keywords and responses.

**Modify Appearance:**

- Change colors: Edit Tailwind classes in `AiChatbot.jsx`
- Change position: Modify `bottom-6 right-6` classes
- Change size: Modify `w-96 h-[600px]`

**Add Features:**

- Message persistence: Store in localStorage
- Voice input: Add Web Speech API
- File attachments: Add file upload
- Feedback: Add thumbs up/down buttons

## API Endpoints

### POST `/util/ai-chat`

Send a message to the AI chatbot.

**Request Body:**

```json
{
  "message": "How do I register?",
  "conversationHistory": [
    {
      "role": "assistant",
      "content": "Hi! How can I help?"
    },
    {
      "role": "user",
      "content": "Previous message"
    }
  ]
}
```

**Response:**

```json
{
  "reply": "To register on CareShare: 1. Click 'Get Started'..."
}
```

### POST `/util/ai-chat/clear`

Clear conversation history (if stored).

**Response:**

```json
{
  "message": "Conversation cleared successfully"
}
```

## Troubleshooting

### Chatbot not appearing

- Check if `AiChatbot.jsx` is imported in `App.jsx`
- Clear browser cache
- Check console for errors

### Local responses only (no AI)

- Normal behavior if no API key configured
- Check `.env` file for API keys
- Verify API key is valid
- Check backend logs for errors

### API errors

- Check API key is correct
- Verify API quota/limits
- Check network connectivity
- Review backend console logs

## Mobile Responsiveness

The chatbot is responsive:

- **Desktop**: Full-size chat window (396px × 600px)
- **Mobile**: Consider adjusting size in CSS for smaller screens

To make it mobile-friendly, modify `AiChatbot.jsx`:

```jsx
<div className="fixed bottom-6 right-6 w-96 sm:w-full sm:right-0 sm:left-0 sm:bottom-0 h-[600px] sm:h-screen ...">
```

## Best Practices

1. **Rate Limiting**: Add rate limiting if using paid APIs
2. **Caching**: Cache common responses to reduce API calls
3. **Error Handling**: Always have fallback responses
4. **Privacy**: Don't send sensitive user data to external APIs
5. **Monitoring**: Track API usage and costs
6. **Testing**: Test all response scenarios

## Future Enhancements

- 📝 Multi-language support
- 🎤 Voice input/output
- 📊 Analytics dashboard
- 💾 Conversation persistence
- 🔔 Proactive suggestions
- 🎨 Custom themes
- 📱 Mobile app version
- 🤝 Integration with support tickets

## Cost Estimates

**Without External API:**

- Cost: $0 (uses local pattern matching)
- Performance: Instant responses
- Limitation: Fixed responses

**With OpenAI GPT-4:**

- Cost: ~$0.01-0.03 per conversation
- Monthly (100 users, 10 convos each): ~$10-30
- Performance: Excellent
- Limitation: API costs

**With Google Gemini:**

- Cost: Free tier (60 requests/min)
- Performance: Very good
- Limitation: Rate limits

**With Hugging Face:**

- Cost: Free
- Performance: Good
- Limitation: Rate limits, smaller models

## Support

For issues or questions:

- **GitHub**: Open an issue
- **Email**: SkillSwap.in@gmail.com
- **Documentation**: See this guide

---

**Happy Helping! 🤖✨**
