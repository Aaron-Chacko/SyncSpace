# SyncSpace Database Schema

## User Collection
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required)
- `timestamps`

## Room Collection
- `name` (String, required)
- `creator` (ObjectId -> User, required)
- `timestamps`

## Session Collection
- `room` (ObjectId -> Room, required)
- `data` (Object)
- `timestamps`