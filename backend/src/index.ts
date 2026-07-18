import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import hotelRoutes from './routes/hotels';
import orderRoutes from './routes/orders';
import adminRoutes from './routes/admin';
import aiRoutes from './routes/ai';
import offerRoutes from './routes/offers';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // For local development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/offers', offerRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Foodie Forecast API is running.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
