import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { username, userId, score } = await request.json();

    // Validate input
    if (!userId || score === undefined) {
      return new Response(
        JSON.stringify({ message: 'User ID and score are required' }),
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Access the "users" collection
    const usersCollection = db.collection('GAME_USERS_PERF');

    // Check if the user exists
    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {
      // If user exists, update the score
      const updatedUser = await usersCollection.updateOne(
        { userId },
        { $set: { score } }
      );
      
      return new Response(
        JSON.stringify({ message: 'User score updated', updatedCount: updatedUser.modifiedCount }),
        { status: 200 }
      );
    } else {
      // If user doesn't exist, create a new user
      const newUser = await usersCollection.insertOne({
        username,
        userId,
        score,
      });

      return new Response(
        JSON.stringify({ message: 'New user created', newUser }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}