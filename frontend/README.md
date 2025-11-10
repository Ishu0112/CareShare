# CareShare Frontend

## Overview

Frontend application for CareShare (Skill Swap) platform built with React, Vite, and Socket.IO for real-time chat functionality.

## Tech Stack

- **React** (v18.2.0) - UI library
- **Vite** (v5.2.11) - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Socket.IO Client** - Real-time WebSocket communication
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

## Project Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images, icons, avatars
│   │   ├── avatar/
│   │   ├── backgrounds/
│   │   └── navbar/
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatBox.jsx      # Individual chat interface
│   │   │   └── ChatList.jsx     # List of all conversations
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   ├── MainHeading.jsx
│   │   │   ├── GetStartedBtn.jsx
│   │   │   ├── Slogan.jsx
│   │   │   └── RegtdUsers.jsx
│   │   ├── Swipe/
│   │   │   ├── Swipe.jsx
│   │   │   └── UserProfileCard.jsx
│   │   ├── User/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── User.jsx
│   │   │   ├── Profile/
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── DataRow.jsx
│   │   │   │   ├── SkillRow.jsx
│   │   │   │   └── VideoUpload.jsx
│   │   │   ├── ProfileUpdate/
│   │   │   │   ├── ProfileUpdate.jsx
│   │   │   │   ├── DataRow.jsx
│   │   │   │   ├── SkillRowEdit.jsx
│   │   │   │   └── SearchableDropdown.jsx
│   │   │   ├── Matches/
│   │   │   │   ├── Matches.jsx
│   │   │   │   ├── MatchDetail.jsx
│   │   │   │   ├── UserListItem.jsx
│   │   │   │   └── SkillVideoPlayer.jsx
│   │   │   └── Username/
│   │   │       ├── Username.jsx
│   │   │       ├── DataRow.jsx
│   │   │       └── SkillRow.jsx
│   │   └── utils/
│   │       ├── Navbar/
│   │       │   ├── Navbar.jsx
│   │       │   ├── Navlink.jsx
│   │       │   ├── Notification.jsx
│   │       │   ├── NotificationItem.jsx
│   │       │   └── NotifPanel.jsx
│   │       ├── ViewProfile/
│   │       │   ├── ViewProfile.jsx
│   │       │   ├── DataRow.jsx
│   │       │   ├── SkillRow.jsx
│   │       │   └── defaultUser.jsx
│   │       ├── Alert.jsx
│   │       ├── AlertProvider.jsx
│   │       ├── Loading.jsx
│   │       ├── LoadingProvider.jsx
│   │       ├── PageHeading.jsx
│   │       ├── ThemeToggle.jsx
│   │       ├── Footer.jsx
│   │       ├── SocketProvider.jsx     # Socket.IO context
│   │       ├── UserProvider.jsx       # User state management
│   │       ├── checkToken.js          # JWT validation
│   │       └── defaultUser.jsx
│   ├── App.jsx                        # Main app component
│   ├── App.css
│   ├── main.jsx                       # Entry point + routes
│   └── index.css                      # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vercel.json
```

## Key Features

### 1. Real-Time Chat

- Live messaging with Socket.IO
- Typing indicators
- Online status
- Message timestamps
- Auto-scroll to latest message
- Message alignment (sent right, received left)

### 2. User Authentication

- JWT-based authentication
- HTTP-only cookies
- Protected routes
- Persistent login sessions

### 3. Skill Matching

- Swipe-based interface
- Match notifications
- View matched users
- User profiles with skills and interests

### 4. Token System

- Token balance display in navbar
- Video upload for skills
- Token transactions for video views
- Real-time token updates

### 5. Dark Mode

- Toggle between light/dark themes
- Persistent theme preference
- Tailwind dark mode classes

## Routes

```javascript
/ or /home                    → Home page
/user/login                   → Login page
/user/register                → Registration page
/user/profile                 → User's own profile
/user/profile-update          → Edit profile
/user/matches                 → List of matched users
/user/matches/:username       → Match detail with videos
/user/chats                   → All chat conversations
/swipe                        → Swipe interface
/chat/:userId                 → Individual chat with user
/:username                    → View any user's profile
```

## Context Providers

### SocketProvider

Manages Socket.IO connection:

- Connects to backend on mount
- Handles reconnection logic
- Provides socket instance to all components
- Manages connection status

### UserProvider

Manages user state:

- Stores logged-in user data
- Provides user info across app
- Handles user updates

### AlertProvider

Global alert system:

- Success/error messages
- Auto-dismiss alerts
- Toast-style notifications

### LoadingProvider

Global loading state:

- Loading spinners
- Async operation indicators

## Environment Variables

Create `.env` file in frontend root:

```plaintext
VITE_BACKEND_URL=http://localhost:3000/
```

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Runs on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Generates optimized build in `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.3",
  "socket.io-client": "^4.7.5",
  "axios": "^1.6.8",
  "tailwindcss": "^3.4.3"
}
```

## Styling

- **Tailwind CSS** for utility classes
- **Dark mode** with `dark:` prefix
- Custom components with Tailwind
- Responsive design (mobile-first)

## API Integration

All API calls use Axios with:

- Base URL from environment variable
- `withCredentials: true` for cookies
- Error handling with try-catch
- Loading states during requests

## Socket.IO Events

### Emit Events:

- `join-room` - Join chat room
- `send-message` - Send message
- `typing` - Typing indicator

### Listen Events:

- `receive-message` - New message
- `user-typing` - Other user typing
- `connect` - Connection established
- `disconnect` - Connection lost

## Best Practices

1. **Component Organization**: Modular component structure
2. **State Management**: Context API for global state
3. **Error Handling**: Try-catch blocks with user feedback
4. **Loading States**: Show loaders during async operations
5. **Responsive Design**: Mobile-friendly layouts
6. **Code Splitting**: Lazy loading for better performance
7. **Environment Variables**: Never commit `.env` files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow existing code structure
2. Use Tailwind CSS for styling
3. Add proper error handling
4. Test on multiple screen sizes
5. Ensure dark mode compatibility
