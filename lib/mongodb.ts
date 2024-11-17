// lib/mongodb.js
import { Db, MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI; // You should set this in your .env.local file
const dbName = process.env.DATABASE_NAME; // Replace with your database name

let cachedClient: null | MongoClient = null;
let cachedDb: null | Db = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri!, {serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
}});
  


  try{
    await client.db("admin").command({ ping: 1 });
  }catch(err){
    await client.connect();
  }

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
