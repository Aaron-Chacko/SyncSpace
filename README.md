# SyncSpace

SyncSpace is a real-time collaborative workspace that combines a collaborative whiteboard and code editor. Multiple users can join shared rooms and work together in real time with synchronized changes.

## Live Demo

**Frontend:** https://client-self-one-32.vercel.app

---

## Tech Stack

### Frontend
- React
- React-Konva
- Monaco Editor
- Yjs
- Socket.io Client

### Backend
- Node.js
- Express.js
- Socket.io
- Yjs
- JWT Authentication

### Database
- MongoDB

### Deployment
- Vercel — Frontend
- Render — Backend

---

## Features

- Real-time collaborative whiteboard
- Real-time collaborative code editor
- Multi-user room support
- Live synchronization using Socket.io
- Conflict-free collaborative editing using Yjs
- User authentication using JWT
- Session persistence
- Replay previous collaboration sessions
- Shared workspace for collaborative development

---

## Project Structure

```text
syncspace/
│
├── client/
├── server/
├── docs/
├── README.md
└── .gitignore
