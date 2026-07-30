# SyncSpace API Documentation

All room and session endpoints require `Authorization: Bearer <token>`.

## Authentication

### `POST /api/auth/signup`

Body: `{ "name", "email", "password" }` (password minimum: 6 characters). Creates an account and returns `{ token, user }`.

### `POST /api/auth/login`

Body: `{ "email", "password" }`. Returns `{ token, user }` for valid credentials.

## Rooms

### `POST /api/rooms`

Creates a room owned by the authenticated user. Body: `{ "roomName", "description?" }`.

### `POST /api/rooms/:roomCode/join`

Adds the authenticated user as a participant in an active room. The room code is the collaboration invite code.

### `GET /api/rooms/:roomId`

Returns a room only to its creator or a participant. `roomId` may be its MongoDB ID or room code.

### `PATCH /api/rooms/:roomId`

Updates name, description, or active status. Creator only.

## Sessions

### `GET /api/sessions/:roomId`

Retrieves saved session data for the room creator or a participant.
