require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supply-chain', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected');

    // Listen for inventory updates
    socket.on('inventoryUpdate', (data) => {
        // Broadcast the update to all connected clients
        io.emit('inventoryChanged', data);
    });

    // Listen for order status changes
    socket.on('orderUpdate', (data) => {
        io.emit('orderStatusChanged', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Error handling for MongoDB
mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // In production, you might want to crash the process
    // process.exit(1);
});