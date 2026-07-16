const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');
const initSocket = require('./config/socket');
const registerSockets = require('./sockets');

dotenv.config();

connectDB();

const server = http.createServer(app);
const io = initSocket(server);
registerSockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});