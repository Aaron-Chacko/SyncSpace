const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/sessions', sessionRoutes);

app.use(errorMiddleware);

module.exports = app;