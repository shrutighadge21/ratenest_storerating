import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import storeRoutes from './routes/storeRoutes';
import userRoutes from './routes/userRoutes';
import ratingRoutes from './routes/ratingRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'RateNest Backend API Server is running.',
    frontendUrl: 'http://localhost:5173',
    healthCheck: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Store Rating Platform API is operational.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
