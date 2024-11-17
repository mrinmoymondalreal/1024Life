// app/api/addData/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    const { db } = await connectToDatabase();
    const collection = db.collection('GAME_USERS');

    const result = await collection.insertOne({
      name,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: 'Data added successfully', data: result }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}