const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/messages', messageRoutes);

app.use('/api/products', productRoutes);

app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});