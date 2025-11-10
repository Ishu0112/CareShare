![CareShare](https://github.com/Wellitsabhi/CareShare/assets/63799853/9e597edd-7a40-4a03-b7d8-0cdeaf1b792f)

# CareShare

## Table of Contents

- [CareShare (Skill Swap)](#careshare-skill-swap)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Usage](#usage)
    - [Register](#register)
    - [Profile Setup](#profile-setup)
    - [Finding a Match](#finding-a-match)
    - [Real-Time Chat](#real-time-chat)
    - [Skill Videos & Tokens](#skill-videos--tokens)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Contributing](#contributing)
  - [Future Plans](#future-plans)
  - [Contributors](#contributors)
  - [License](#license)
  - [Contact](#contact)

## Features

- **User Registration**: Easy signup process to create an account
- **Profile Setup**: Users can list their skills and interests
- **Matchmaking**: Swipe-based interface to find users with complementary skills
- **Real-Time Chat**: Live messaging with matched users using Socket.IO
- **Skill Videos**: Upload and share skill demonstration videos (YouTube/Vimeo/direct links)
- **Token System**: Earn tokens when others watch your videos, spend tokens to watch others
- **Video Rating System**: Rate videos (1-5 stars) from matched users, view average ratings
- **Skill Assessment Tests**: Take timed quizzes to verify skill proficiency and earn certificates
- **Notifications**: Stay updated with match requests, ratings, and activity
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Usage

### Register

1. Open the app and click on the 'Get started' button
2. Fill in the required details (first name, last name, email, password)
3. Create your account

### Profile Setup

1. After registration, log in to your account
2. Navigate to the 'Profile' section
3. Add your skills (what you can teach others)
4. Add your interests (what you want to learn)
5. Upload skill demonstration videos (optional)
6. Write a bio to introduce yourself

### Finding a Match

1. Navigate to the 'Swipe' section
2. Browse through user profiles with complementary skills
3. Swipe right to send a match request
4. Swipe left to skip
5. When both users match, you'll be notified

### Real-Time Chat

1. Go to 'Matches' section to see all your matched users
2. Click the 💬 Chat button next to any match
3. Start a real-time conversation
4. Messages appear instantly with typing indicators
5. Access all your conversations from the 'Chats' section in the navbar

### Skill Videos & Tokens

1. Upload skill videos from your Profile page (supports YouTube, Vimeo, or direct video URLs)
2. Users start with 100 tokens
3. Spend 5 tokens to watch someone's skill video
4. Earn 5 tokens when someone watches your video
5. View your token balance in the navbar (🪙 icon)
6. Rate videos after watching (1-5 stars)
7. View average ratings on user profiles

### Skill Assessment Tests

1. Navigate to the 'Tests' section from the navbar
2. Browse available tests (Web Development, Cooking, Mobile App Development, Photography, Machine Learning)
3. Click 'Start Test' to begin a timed challenge
4. Answer 10 multiple-choice questions within 5 minutes
5. Submit test and view instant results with answer review
6. Score 70% or higher to pass and earn a certificate
7. Retake tests unlimited times to improve your score
8. View your test history and certificates in the Tests section

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v20.0+)
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (for database)
- **Git** for version control

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ishu0112/CareShare.git
   cd CareShare
   ```

2. **Install Backend Dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**

   Create `.env` file in **backend** folder:

   ```plaintext
   DATABASE_USERNAME=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   SECRET_KEY=your_jwt_secret_key
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

   Create `.env` file in **frontend** folder:

   ```plaintext
   VITE_BACKEND_URL=http://localhost:3000/
   ```

5. **Start the Backend Server:**

   ```bash
   cd backend
   npm start
   ```

   Backend will run on `http://localhost:3000`

6. **Start the Frontend Development Server:**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

7. **Open your browser and visit:**
   ```
   http://localhost:5173
   ```

## Tech Stack

### Frontend

- **React.js** (v18.2.0+) - UI Library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework

### Backend

- **Node.js** - Runtime environment
- **Express.js** (v4.19.2+) - Web framework
- **MongoDB** with **Mongoose** - Database
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie handling

## Project Structure

```
CareShare/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── chatController.js     # Chat functionality
│   │   ├── homeController.js
│   │   ├── swipeController.js
│   │   ├── testController.js     # Skill test logic & grading
│   │   └── userController.js     # User + Token + Video + Rating functions
│   ├── data/
│   │   └── testQuestions.js      # Quiz questions for skill tests
│   ├── middlewares/
│   │   └── authCheck.js          # JWT authentication
│   ├── models/
│   │   ├── chatModel.js          # Chat & Message schema
│   │   ├── skillModel.js
│   │   └── userModel.js          # User schema with tests & ratings
│   ├── routes/
│   │   ├── adminRouter.js
│   │   ├── chatRouter.js         # Chat endpoints
│   │   ├── homeRouter.js
│   │   ├── swipeRouter.js
│   │   ├── testRouter.js         # Test endpoints
│   │   └── userRouter.js         # User + Rating endpoints
│   ├── utils/
│   │   ├── tokenizer.js          # JWT creation
│   │   └── detokenizer.js        # JWT verification
│   ├── app.js                    # Main server + Socket.IO
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/               # Images and icons
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatBox.jsx   # Individual chat interface
│   │   │   │   └── ChatList.jsx  # All conversations
│   │   │   ├── Home/
│   │   │   ├── Swipe/
│   │   │   ├── User/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── Profile/
│   │   │   │   │   └── VideoUpload.jsx
│   │   │   │   ├── ProfileUpdate/
│   │   │   │   ├── SkillTests/
│   │   │   │   │   ├── SkillTests.jsx      # Test dashboard
│   │   │   │   │   ├── TestChallenge.jsx   # Timed quiz interface
│   │   │   │   │   └── TestResults.jsx     # Results & certificates
│   │   │   │   └── Matches/
│   │   │   │       ├── MatchDetail.jsx
│   │   │   │       ├── SkillVideoPlayer.jsx  # Video player
│   │   │   │       └── VideoRating.jsx       # Rating component
│   │   │   └── utils/
│   │   │       ├── Navbar/
│   │   │       ├── SocketProvider.jsx  # Socket.IO context
│   │   │       ├── UserProvider.jsx    # User context
│   │   │       └── ViewProfile/
│   │   ├── App.jsx
│   │   ├── main.jsx              # Routes configuration
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── CHAT_FEATURE_IMPLEMENTATION.md
├── SOCKET_FIX_GUIDE.md
└── README.md
```

## Future Plans

- **Advanced Analytics Dashboard**: Personal learning statistics and progress tracking
- **Scheduled Sessions**: Calendar integration for booking skill exchange sessions
- **Certificate Verification**: Public certificate verification system
- **More Test Categories**: Expand skill tests to 20+ categories
- **Mobile App**: Develop a mobile application for iOS and Android
- **Group Skill Swaps**: Allow users to join group sessions for skill exchanges
- **Video Call Integration**: Direct video calls between matched users
- **Gamification**: Introduce badges, levels, and achievements
- **Advanced Matchmaking**: Implement AI-based matchmaking for better skill pairings
- **File Sharing**: Share documents and images in chat
- **Search Functionality**: Search through chat history and users
- **Skill Endorsements**: Get verified by other users for your skills
- **Learning Paths**: Curated sequences of skills to learn
- **Portfolio Showcase**: Display projects and work samples

---

**Made by the CareShare Team**
