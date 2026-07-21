import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import accidentRoutes from './routes/accidentRoutes.js';
import cameraRoutes from './routes/cameraRoutes.js';
dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder', 'bypass-tunnel-reminder']
}));
app.use(express.json());

app.use('/api/accidents', accidentRoutes);
app.use('/api/cameras', cameraRoutes);
app.get('/', (req, res) => {
    res.json({ message: 'Sentry Accident Detection API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
