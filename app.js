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
  switch (err.message) {
    case 'CreationDataIncomplete':
      return res.status(400).json({ error: 'incomplete-data'})
    break;
    case 'jwt malformed':
      return res.status(400).json({ error: 'invalid-token'})
    break;
    case 'PostNotFound':
        return res.status(404).json({ error: 'post-not-found' });
    break;
    case 'InvalidKey':
        return res.status(400).json({ error: 'bad-request' });
    break;
    case 'UpdateActive':
        return res.status(500).json({ error: 'updating-error' });
    break;
    case 'NoActivatedUser':
        return res.status(403).json({ error: 'no-activated-user' });
    break;
  }
});

connect()
 .then((result) => {
  app.listen(process.env.PORT, () => {
    console.log(`Backend listening at :${process.env.PORT}`);
  })
 }).catch((err) => {
  console.log('Error connecting to imdb:', err);
 });
