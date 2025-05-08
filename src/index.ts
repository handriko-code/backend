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


app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use('/api/public/events', publicEventRouter);
app.use('/api/transaction', transactionRouter)
app.use('/api/dashboard', dashboardRouter);
app.use('/api/rewards', userRewardRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
