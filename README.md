# College Media

**College Media** is a community-driven web platform designed to encourage seamless interaction between engineering students—especially juniors and seniors—by reducing hesitation in asking questions, sharing resources, and starting discussions. The platform provides structured features to support students who may feel shy or uncertain in reaching out for help, particularly in offline academic settings.

This application aims to:
- Help juniors get academic and placement-related guidance from seniors.
- Support anonymous interactions, allowing students to ask questions without fear of judgment.
- Promote collaborative learning through discussions and easy resource sharing.

It’s ideal for students who:
- Hesitate to ask doubts openly in class or directly to seniors.
- Prefer anonymous academic help and peer-based learning.
- Want to share or find branch-specific study materials quickly.

---

## Features

### 🔐 Authentication
- Google OAuth2-based login system with secure session management.
- Profile creation and image upload using **ImageKit.io**.

### ❓ Ask Section
- Post questions anonymously or publicly.
- Tag system for categorizing content (subjects, topics, domains).
- Upvote and save questions for later.

### 💬 Chat System
- Real-time messaging using Socket.IO.
- Three types of chats:
  - **Normal Chats:** Regular conversations.
  - **Anonymous Sent Chats:** Message someone anonymously.
  - **Anonymous Received Chats:** View messages received anonymously.

### 📂 Material Section
- Upload Google Drive links for PDFs and notes.
- File preview thumbnails using Drive's public share links.
- Grid-based material viewer with file name display.

### 🧵 Discussions
- Answer and comment on questions.
- Engage in tag-based group discussions.
- Helpful for placement prep, coding doubts, or subject clarifications.

### 👤 Profile
- View your own and others’ contributions.
- Saved questions, discussions, and uploaded materials.
- Points system to track community participation.

---

## Tech Stack

### Frontend
- React.js (with Vite)
- Tailwind CSS
- React Router DOM
- React Query
- Axios
- Socket.IO Client
- **ImageKit.io** for profile & material image handling

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- Passport.js (Google OAuth)
- Socket.IO for real-time chat
- Cookie-based session authentication

### Deployment
- Deployed on **Render** for both client and server.
- WebSocket and HTTP handled on the same server.
- Supports persistent connections and CORS configuration.

---

## Developer

Built and maintained by **Hemanth Kumar Vaddipalli**  
[LinkedIn](https://www.linkedin.com/in/hemanth-kumar-vaddipalli-083915257/) | [GitHub](https://github.com/heamu)


