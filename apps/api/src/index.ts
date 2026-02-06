import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import collectionRoutes from './routes/collection';
import userRoutes from './routes/user';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
