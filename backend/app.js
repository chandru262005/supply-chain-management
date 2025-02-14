const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = 'mongodb+srv://chandhuru2020:kjkszpjlxgiwyl@chan-cluster.pqiuk.mongodb.net/'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;