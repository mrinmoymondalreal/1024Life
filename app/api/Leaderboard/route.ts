import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const usersCollection = db.collection('GAME_USERS_PERF');

    const topScores = await usersCollection
      .find()
      .sort({ score: -1 })
      .limit(10)
      .toArray();

    return new Response(JSON.stringify(topScores), { status: 200 });
  } catch (error) {
    console.error('Error fetching top scores:', error);
    return new Response(
      JSON.stringify({ message: 'Error fetching top scores', error: "Unexpected Problem Occurred" }),
      { status: 500 }
    );
  }
}