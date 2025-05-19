import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routers/authRouter';
import eventRouter from './routers/eventRouter';
import publicEventRouter from './routers/publicEventRouter';
import transactionRouter from './routers/transactionRouter';
import dashboardRouter from './routers/dashboardRouter';
import userRewardRouter from './routers/userRewardRouter';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from server');
});


app.use('/api/auth', authRouter); // Login & Register
app.use('/api/events', eventRouter); // CRUD event - untuk organizer membuat dan mengatur event.
app.use('/api/public/events', publicEventRouter); // Browse event (Customer/Public)
app.use('/api/transaction', transactionRouter); // Customer Beli tiket
app.use('/api/dashboard', dashboardRouter); // untuk melihat data statistik event (khusus organizer).
app.use('/api/rewards', userRewardRouter); // untuk sitem Kupon, poin, referral

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
