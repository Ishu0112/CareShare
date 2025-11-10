# CareShare Backend API Documentation

## Overview

Backend server for CareShare (Skill Swap) platform built with Node.js, Express.js, MongoDB, and Socket.IO for real-time communication.

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require JWT authentication via HTTP-only cookies. Protected routes use the `authCheck` middleware.

---

## API Endpoints

### Home Router (`/home`)

#### Get User Count

- **GET** `/home`
- Returns total count of registered users
- **Public** - No authentication required

---

### User Router (`/user`)

#### Register User

- **POST** `/user/register`
- Creates a new user account
- **Body**: `{ fname, lname, email, password }`
- **Public**

#### Login

- **POST** `/user/login`
- Authenticates user and sets JWT cookie
- **Body**: `{ email, password }`
- **Returns**: User profile with `_id`, skills, interests, matches, tokens, skillVideos
- **Public**

#### Logout

- **POST** `/user/logout`
- Clears authentication cookie
- **Protected**

#### View Profile

- **POST** `/user/profile`
- Fetch user profile by ID or username
- **Body**: `{ _id }` or `{ username }`
- **Returns**: Profile with `_id`, fname, lname, skills, interests, bio, tokens, skillVideos
- **Protected**

#### Get Matches

- **POST** `/user/matches`
- Get list of matched users
- **Body**: `{ _id }`
- **Returns**: Array of matches with `_id`, name, username, skillVideos
- **Protected**

#### Update Profile

- **POST** `/user/profile-update`
- Update user information
- **Body**: `{ fname, lname, email, username, bio }`
- **Protected**

#### Update Skills

- **POST** `/user/:userId/skills-update`
- Add or update user skills
- **Body**: `{ skills: [skillIds] }`
- **Protected**

#### Update Interests

- **POST** `/user/:userId/interests-update`
- Add or update user interests
- **Body**: `{ interests: [interestIds] }`
- **Protected**

#### Get Notifications

- **POST** `/user/notifications`
- Fetch user notifications
- **Protected**

#### Save Skill Video URL

- **POST** `/user/skill-video`
- Save video URL for a specific skill
- **Body**: `{ skill, videoUrl }`
- **Protected**

#### Delete Skill Video

- **DELETE** `/user/skill-video`
- Remove video for a skill
- **Body**: `{ skill }`
- **Protected**

#### Watch Video

- **POST** `/user/watch-video`
- Record video view, deduct tokens from viewer, add to owner
- **Body**: `{ videoOwnerUsername, skillName }`
- **Cost**: 5 tokens per view
- **Protected**

#### Get Token Balance

- **GET** `/user/tokens`
- Get current user's token balance
- **Returns**: `{ tokens, username }`
- **Protected**

---

### Chat Router (`/chat`)

#### Get All Chats

- **GET** `/chat/`
- Get all chat conversations for current user
- **Returns**: Array of chats with populated participants (fname, lname, username, email)
- **Protected**

#### Get or Create Chat

- **POST** `/chat/create`
- Get existing chat or create new one with another user
- **Body**: `{ participantId }`
- **Returns**: Chat object with populated participants
- **Protected**

#### Get Chat by ID

- **GET** `/chat/:chatId`
- Get specific chat with all messages
- **Returns**: Chat with populated messages and participants
- **Protected**

#### Send Message

- **POST** `/chat/:chatId/message`
- Send a message in a chat
- **Body**: `{ content }`
- **Protected**

#### Mark Messages as Read

- **PUT** `/chat/:chatId/read`
- Mark all messages from other user as read
- **Protected**

#### Delete Chat

- **DELETE** `/chat/:chatId`
- Delete a chat conversation
- **Protected**

---

### Swipe Router (`/swipe`)

#### Get Potential Matches

- **POST** `/swipe/potential-matches`
- Get list of users to swipe on
- **Body**: `{ _id }`
- **Protected**

#### Accept Match

- **POST** `/swipe/accept`
- Accept a match request
- **Body**: `{ userId, matchId }`
- **Protected**

#### Reject Match

- **POST** `/swipe/reject`
- Reject a potential match
- **Body**: `{ userId, rejectedUserId }`
- **Protected**

---

### Admin Router (`/admin`)

#### Get All Users

- **GET** `/admin/users`
- Fetch all registered users
- **Protected**

#### Get All Skills

- **GET** `/admin/skills`
- Fetch all available skills
- **Protected**

#### Add New Skill

- **POST** `/admin/add/skill`
- Add a new skill to the platform
- **Body**: `{ name, category }`
- **Protected**

#### Add New User

- **POST** `/admin/add/user`
- Manually create a new user (admin only)
- **Protected**

---

## Socket.IO Events

### Server Events (Listen)

#### `connection`

- New client connects to Socket.IO server
- Server logs: "New client connected: {socketId}"

#### `join-room`

- User joins a chat room
- **Payload**: `{ chatId }`
- Server logs: "Socket {socketId} joined room {chatId}"

#### `send-message`

- User sends a message
- **Payload**: `{ chatId, content, sender, timestamp }`
- Server emits `receive-message` to all users in the room

#### `typing`

- User is typing indicator
- **Payload**: `{ chatId, userId, isTyping }`
- Server broadcasts to other users in room

#### `disconnect`

- Client disconnects
- Server logs: "Client disconnected: {socketId}"

### Client Events (Emit)

#### `receive-message`

- Receive a new message in real-time
- **Payload**: `{ chatId, content, sender, timestamp }`

#### `user-typing`

- Another user is typing
- **Payload**: `{ userId, isTyping }`

---

## Database Models

### User Schema

```javascript
{
  fname: String,
  lname: String,
  email: String (unique),
  password: String (hashed),
  username: String (unique),
  bio: String,
  skills: [ObjectId] (ref: Skill),
  interests: [ObjectId] (ref: Skill),
  matches: [ObjectId] (ref: User),
  matchRequests: [ObjectId] (ref: User),
  rejected: [ObjectId] (ref: User),
  notifications: [String],
  skillVideos: Map (skill -> videoUrl),
  tokens: Number (default: 100)
}
```

### Chat Schema

```javascript
{
  participants: [ObjectId] (ref: User),
  messages: [MessageSchema],
  lastMessage: Date,
  createdAt: Date
}
```

### Message Schema

```javascript
{
  sender: ObjectId (ref: User),
  content: String,
  timestamp: Date,
  isRead: Boolean
}
```

### Skill Schema

```javascript
{
  name: String (unique),
  category: String
}
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200**: Success
- **201**: Created/Success with alternate message
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden (insufficient tokens, etc.)
- **404**: Not Found
- **500**: Internal Server Error

---

## Environment Variables

```plaintext
DATABASE_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
SECRET_KEY=your_jwt_secret
PORT=3000
FRONTEND_URL=http://localhost:5173
```

---

## Running the Server

```bash
cd backend
npm install
node app.js
```

Server will start on `http://localhost:3000` with Socket.IO enabled.
