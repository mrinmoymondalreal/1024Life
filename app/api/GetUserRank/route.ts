import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    const userid = request.nextUrl.searchParams.get('userid');

    const usersCollection = db.collection('GAME_USERS_PERF');

    const user = await usersCollection.findOne({ userId: userid });

  if (!user) {
    return new Response("user not found", {status: 404});
  }

  const userScore = user.score;

  const rank = await usersCollection.countDocuments({ score: { $gt: userScore } });



    return new Response((rank + 1).toString(), { status: 200 });
  } catch (error) {
    console.error('Error fetching top scores:', error);
    return new Response(
      JSON.stringify({ message: 'Error fetching top scores', error: "Unexpected Problem Occurred" }),
      { status: 500 }
    );
  }
}