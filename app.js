import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connect from './database/connection.js';

const app = express();
app.use(express.json());

connect()
 .then((result) => {
  app.listen(process.env.PORT, () => {
    console.log(`Backend listening at :${process.env.PORT}`);
  })
 }).catch((err) => {
  console.log('Error connecting to imdb:', err);
 });

 // Error handling
