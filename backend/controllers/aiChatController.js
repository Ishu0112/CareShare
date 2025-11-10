// AI Chat Controller for CareShare Helper Bot

// Option 1: Using OpenAI API (uncomment if you have API key)
// const OpenAI = require('openai');
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// Option 2: Using Google Gemini API (uncomment if you have API key)
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiChat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // System prompt for the AI
    const systemPrompt = `You are a helpful AI assistant for CareShare (Skill Swap), a platform where users exchange skills.

Your role is to help users understand and navigate the platform. Here's what you need to know:

PLATFORM FEATURES:
- User registration and authentication
- Profile creation with skills (what you teach) and interests (what you learn)
- Swipe-based matchmaking to find complementary skill partners
- Real-time chat with matched users using Socket.IO
- Token system: Users start with 100 tokens, earn 5 tokens when someone watches their video, spend 5 tokens to watch others
- Skill video uploads to demonstrate abilities
- Dark mode theme toggle
- Notifications for matches and activities

KEY WORKFLOWS:
1. Registration → Profile Setup → Swipe → Match → Chat
2. Upload videos → Earn tokens → Watch others' videos

COMMON USER QUESTIONS:
- How to register and set up profile
- How matching works (swipe right to like, left to skip)
- How to use chat feature
- Understanding tokens and video system
- Troubleshooting issues

Be friendly, concise, and helpful. Use emojis occasionally. Keep responses under 200 words.`;

    // OPTION 1: Using OpenAI GPT-4 (requires API key)
    /*
    if (process.env.OPENAI_API_KEY) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return res.status(200).json({
        reply: completion.choices[0].message.content
      });
    }
    */

    // OPTION 2: Using Google Gemini (requires API key)
    /*
    if (process.env.GEMINI_API_KEY) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Build conversation context
      const context = conversationHistory
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      
      const prompt = `${systemPrompt}\n\nConversation:\n${context}\n\nUser: ${message}\n\nAssistant:`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return res.status(200).json({
        reply: text
      });
    }
    */

    // OPTION 3: Using Hugging Face API (free tier available)
    /*
    if (process.env.HUGGINGFACE_API_KEY) {
      const axios = require('axios');
      
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
        {
          inputs: message,
          parameters: {
            max_length: 300
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
          }
        }
      );

      return res.status(200).json({
        reply: response.data[0].generated_text
      });
    }
    */

    // FALLBACK: If no API key is configured, return a helpful response
    console.log("AI Chat request received:", message);
    console.log(
      "Note: Configure OPENAI_API_KEY, GEMINI_API_KEY, or HUGGINGFACE_API_KEY in .env for AI responses"
    );

    return res.status(200).json({
      reply:
        "I'm currently using local responses. For AI-powered answers, the administrator needs to configure an API key. In the meantime, try asking specific questions like:\n\n• How do I register?\n• How to find matches?\n• What are tokens?\n• How to use chat?\n\nI can help with these topics!",
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return res.status(500).json({
      error: "Failed to process chat request",
      message: error.message,
    });
  }
};

// Optional: Clear conversation history
const clearConversation = async (req, res) => {
  try {
    // In a real app, you might want to store conversation history in DB
    // For now, just acknowledge the request
    return res.status(200).json({
      message: "Conversation cleared successfully",
    });
  } catch (error) {
    console.error("Clear conversation error:", error);
    return res.status(500).json({
      error: "Failed to clear conversation",
    });
  }
};

module.exports = {
  aiChat,
  clearConversation,
};
