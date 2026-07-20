import Y from 'yjs';

class YjsService {
  constructor() {
    this.docs = new Map();
  }

  getDoc(roomName) {
    if (!this.docs.has(roomName)) {
      this.docs.set(roomName, new Y.Doc());
    }
    return this.docs.get(roomName);
  }
}

export default new YjsService();
