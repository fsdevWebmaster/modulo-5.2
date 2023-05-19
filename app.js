import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connect from './database/connection.js';
import appRouter from './routes/app.routes.js';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

app.use('/api', appRouter);

// Errors
app.use((err, req, res, next) => {

  console.log('err:::', err);

  if(err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ errors: err.errors });
  }
  res.status(500).json({ mderror: 'internal-server-error' });
});

connect()
 .then((result) => {
  app.listen(process.env.PORT, () => {
    console.log(`Backend listening at :${process.env.PORT}`);
  })
 }).catch((err) => {
  console.log('Error connecting to imdb:', err);
 });
