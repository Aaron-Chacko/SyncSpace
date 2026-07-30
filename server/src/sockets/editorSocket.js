import * as Y from 'yjs';
import yjsService from '../services/yjsService.mjs';

export default function editorSocketHandler(io, socket) {
  // Listen for client joining Yjs session
  socket.on('yjs-join', ({ roomId }) => {
    socket.join(roomId);
    
    // Get or create Yjs document for the room
    const doc = yjsService.getDoc(roomId);
    
    // Encode current document state as update
    const stateUpdate = Y.encodeStateAsUpdate(doc);
    
    // Send initial state to the client
    socket.emit('yjs-init', Buffer.from(stateUpdate));
  });

  // Listen for Yjs document updates from client
  socket.on('yjs-update', ({ roomId, update }) => {
    const doc = yjsService.getDoc(roomId);
    
    // Apply update to server document
    Y.applyUpdate(doc, new Uint8Array(update));
    
    // Broadcast the update to all other clients in the room
    socket.to(roomId).emit('yjs-update', update);
  });

  // Listen for Yjs awareness updates from client (ephemeral)
  socket.on('yjs-awareness', ({ roomId, update }) => {
    // Broadcast the awareness update to all other clients in the room
    socket.to(roomId).emit('yjs-awareness', update);
  });
}