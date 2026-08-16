import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', process.env.FRONTEND_URL], // update later with actual origins
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

import petRoutes from './routes/pets.js';
import requestRoutes from './routes/requests.js';

import { auth } from './utils/auth.js';
import { toNodeHandler } from 'better-auth/node';

// The correct way in express 5 is regex or named parameters:
app.all(/^\/api\/auth(?:\/.*)?$/, toNodeHandler(auth.handler));

app.use('/api/pets', petRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
  res.send('Pet Adoption API is running');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-adoption')
  .then(() => {
    console.log('Connected to MongoDB');
    if (process.env.NODE_ENV !== 'production') { app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); }
  })
  .catch(err => console.error('MongoDB connection error:', err));

export default app;
