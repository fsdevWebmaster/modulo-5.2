import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export default async function connect() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  try {
    await mongoose.connect(mongoUri, { dbName: 'inmemdb' });
    console.log(`Mongo db connected at ${mongoUri}`);    
  } catch (error) {
    console.log('Can\'t connect to mongodb:', error);
  }
}