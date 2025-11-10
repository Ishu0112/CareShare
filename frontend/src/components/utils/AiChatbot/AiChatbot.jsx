import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your CareShare assistant. I can help you with:\n\n• Getting started with the platform\n• Finding and matching with other users\n• Using the chat feature\n• Understanding the token system\n• Uploading skill videos\n• Any other questions!\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Try to get AI response from backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}util/ai-chat`,
        {
          message: userMessage,
          conversationHistory: messages.slice(-6), // Last 6 messages for context
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (error) {
      console.error("AI Chat error:", error);

      // Fallback: Local responses based on keywords
      const botReply = generateLocalResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: botReply },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    // Getting Started
    if (
      lowerMessage.includes("start") ||
      lowerMessage.includes("begin") ||
      lowerMessage.includes("how to use")
    ) {
      return "🚀 **Getting Started with CareShare:**\n\n1. **Register**: Click 'Get Started' and create your account\n2. **Setup Profile**: Add your skills (what you can teach) and interests (what you want to learn)\n3. **Swipe**: Find users with complementary skills\n4. **Match**: When both users like each other, you're matched!\n5. **Chat**: Start chatting with your matches\n\nWould you like help with any specific step?";
    }

    // Registration
    if (
      lowerMessage.includes("register") ||
      lowerMessage.includes("sign up") ||
      lowerMessage.includes("create account")
    ) {
      return "📝 **Registration Steps:**\n\n1. Click the 'Get Started' button on the home page\n2. Fill in your:\n   • First Name\n   • Last Name\n   • Email address\n   • Password (6-20 characters)\n3. Click 'Register'\n4. You'll be redirected to login\n\nAfter logging in, complete your profile with skills and interests!";
    }

    // Matching/Swipe
    if (
      lowerMessage.includes("match") ||
      lowerMessage.includes("swipe") ||
      lowerMessage.includes("find")
    ) {
      return "💫 **Finding Matches:**\n\n1. Go to the 'Swipe' section from the navbar\n2. Browse through user profiles\n3. **Swipe Right** (or click Accept) if you're interested\n4. **Swipe Left** (or click Reject) to skip\n5. When both users swipe right, it's a match! 🎉\n6. View all matches in the 'Matches' section\n\nTip: Make sure to complete your profile first for better matches!";
    }

    // Chat
    if (lowerMessage.includes("chat") || lowerMessage.includes("message")) {
      return "💬 **Using the Chat Feature:**\n\n1. Go to 'Matches' page\n2. Click the 💬 Chat button next to any match\n3. Start typing your message\n4. Press Enter or click Send\n\n**Features:**\n• Real-time messaging\n• Typing indicators\n• Online status\n• Message history\n\nAccess all conversations from the 'Chats' link in the navbar!";
    }

    // Tokens
    if (
      lowerMessage.includes("token") ||
      lowerMessage.includes("coin") ||
      lowerMessage.includes("earn")
    ) {
      return "🪙 **Token System:**\n\n**Starting Balance:** 100 tokens\n\n**How to Earn:**\n• Someone watches your skill video → +5 tokens\n\n**How to Spend:**\n• Watch someone's skill video → -5 tokens\n\n**View Balance:**\n• Check the 🪙 icon in the navbar\n\n**Tips:**\n• Upload quality skill videos to earn more\n• Tokens help you learn from others' videos";
    }

    // Videos
    if (
      lowerMessage.includes("video") ||
      lowerMessage.includes("upload") ||
      lowerMessage.includes("skill demonstration")
    ) {
      return "🎥 **Skill Videos:**\n\n**Upload Videos:**\n1. Go to your Profile page\n2. Find the 'Skill Videos' section\n3. Click 'Upload Video' for any skill\n4. Paste the video URL (YouTube, Vimeo, etc.)\n5. Click Save\n\n**Watch Videos:**\n1. Go to 'Matches' → Click on a match\n2. View their skill videos\n3. Costs 5 tokens to watch\n\nVideos help showcase your skills!";
    }

    // Profile
    if (
      lowerMessage.includes("profile") ||
      lowerMessage.includes("edit") ||
      lowerMessage.includes("update")
    ) {
      return "👤 **Profile Management:**\n\n**View Profile:**\n• Click 'User' in the navbar\n\n**Edit Profile:**\n1. Go to Profile page\n2. Click 'Edit Profile'\n3. Update:\n   • Name, Email, Username\n   • Bio\n   • Skills (what you teach)\n   • Interests (what you learn)\n4. Click 'Update Profile'\n\n**Add Skills/Interests:**\n• Use the searchable dropdown\n• Select multiple skills\n• Save changes";
    }

    // Skills/Interests
    if (
      lowerMessage.includes("skill") ||
      lowerMessage.includes("interest") ||
      lowerMessage.includes("what can i teach")
    ) {
      return "🎯 **Skills & Interests:**\n\n**Skills** = What you can TEACH others\n**Interests** = What you want to LEARN\n\n**Examples:**\n• Skills: Cooking, Web Development, Guitar\n• Interests: Photography, Data Science, Yoga\n\n**Add Them:**\n1. Go to Profile → Edit Profile\n2. Use the searchable dropdown\n3. Select multiple items\n4. Save\n\nGood matches happen when your interests match others' skills!";
    }

    // Notifications
    if (
      lowerMessage.includes("notification") ||
      lowerMessage.includes("alert")
    ) {
      return "🔔 **Notifications:**\n\nYou'll receive notifications for:\n• New match requests\n• Match confirmations\n• Token earnings (video views)\n• Token spending (watching videos)\n\n**View Notifications:**\n• Click the bell icon (🔔) in the navbar\n\n**Types:**\n• Match notifications\n• Token transactions\n• System updates";
    }

    // Dark Mode
    if (
      lowerMessage.includes("dark mode") ||
      lowerMessage.includes("theme") ||
      lowerMessage.includes("light mode")
    ) {
      return "🌙 **Dark Mode:**\n\nToggle between light and dark themes!\n\n**How to Switch:**\n• Click the theme toggle button in the navbar\n• Changes apply instantly\n• Your preference is saved\n\nDark mode is easier on the eyes at night! 😊";
    }

    // Troubleshooting
    if (
      lowerMessage.includes("not working") ||
      lowerMessage.includes("error") ||
      lowerMessage.includes("problem") ||
      lowerMessage.includes("issue")
    ) {
      return "🔧 **Troubleshooting:**\n\n**Common Issues:**\n\n1. **Can't log in?**\n   • Check email/password\n   • Clear browser cache\n   • Try different browser\n\n2. **Chat not working?**\n   • Refresh the page\n   • Check internet connection\n   • Make sure you're matched\n\n3. **Messages not sending?**\n   • Check connection\n   • Reload the page\n\n4. **Can't see matches?**\n   • Complete your profile first\n   • Try swiping more users\n\nStill having issues? Contact: SkillSwap.in@gmail.com";
    }

    // Help/What can you do
    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("what can you") ||
      lowerMessage.includes("assist")
    ) {
      return "🤖 **I can help you with:**\n\n• Getting started guide\n• Registration & login\n• Profile setup\n• Finding matches (Swipe feature)\n• Using the chat\n• Understanding tokens\n• Uploading videos\n• Managing your profile\n• Dark mode\n• Troubleshooting issues\n\nJust ask me anything like:\n• 'How do I register?'\n• 'How to find matches?'\n• 'What are tokens?'\n• 'How to upload videos?'";
    }

    // Contact/Support
    if (
      lowerMessage.includes("contact") ||
      lowerMessage.includes("support") ||
      lowerMessage.includes("email")
    ) {
      return "📧 **Contact & Support:**\n\n**Email:** SkillSwap.in@gmail.com\n\n**GitHub Issues:**\nhttps://github.com/Wellitsabhi/SkillSwap/issues\n\n**For:**\n• Technical issues\n• Feature requests\n• Bug reports\n• General inquiries\n\nWe typically respond within 24-48 hours!";
    }

    // Default response
    return "I'm here to help! You can ask me about:\n\n• **Getting Started** - How to use CareShare\n• **Registration** - Creating your account\n• **Matching** - Finding skill partners\n• **Chat** - Messaging features\n• **Tokens** - Earning and spending\n• **Videos** - Uploading skill demos\n• **Profile** - Managing your info\n• **Troubleshooting** - Fixing issues\n\nTry asking something like 'How do I get started?' or 'What are tokens?'";
  };

  const quickQuestions = [
    "How do I get started?",
    "How to find matches?",
    "What are tokens?",
    "How to use chat?",
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label="Open AI Helper"
        >
          <span className="text-2xl">🤖</span>
          <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            AI
          </span>
          <div className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Need help? Ask me!
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-3xl">🤖</span>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Helper</h3>
                <p className="text-xs opacity-90">Always here to help! ✨</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Close chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
