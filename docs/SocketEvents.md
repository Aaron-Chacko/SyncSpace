# SyncSpace Socket Events

## Connection

- `connection`: Fired when a client connects.
- `disconnect`: Fired when a client disconnects.

## Room events

- `join-room`: Send a room code (or `{ roomCode }`) to join. An optional acknowledgement receives `{ ok, roomCode, users }`.
- `leave-room`: Leave a room explicitly.
- `user-joined`, `user-left`, `room-users`: Membership broadcasts for collaborative sessions.

## Whiteboard events

- `draw-element`, `update-element`: Send `{ room, element }`; peers receive the element.
- `draw-line`: Send `{ room, ...drawingData }`; peers receive the drawing payload.
- `clear-canvas`: Send `{ room }`; peers receive the event without a payload.
- `cursor-move`: Send `{ room, x, y, name?, color? }`; peers receive it with the originating `socketId`.
- `cursor-leave`: Broadcast when a collaborator leaves a room or disconnects.

## Editor events

- `editor-update` and `code-change`: Send `{ room, ...content }`; peers receive the payload.

All collaboration events are relayed only when the sender has joined the target room.
