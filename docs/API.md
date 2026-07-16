# SyncSpace API Documentation

## Auth Endpoints
### POST /api/auth/signup
- Registers a new user.

### POST /api/auth/login
- Authenticates a user and returns a token.

## Room Endpoints
### POST /api/rooms
- Creates a new collaborative room.

### GET /api/rooms/:roomId
- Retrieves room information.

## Session Endpoints
### GET /api/sessions/:roomId
- Retrieves the history of a session for replay.