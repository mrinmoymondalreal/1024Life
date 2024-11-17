"use client";

import Button from "@/components/button";
import { UsernameAtom } from "@/lib/store";
import { useAtomValue } from "jotai";
import { BarChart2Icon, PlayIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const username = useAtomValue(UsernameAtom);

  return (
    <div className="font-doto font-black text-white text-4xl space-y-10 px-6">
      <div className="text-center">Welcome, {username}</div>
      <div className="bg-gray-500 w-48 rounded-full aspect-square">
        <img
          src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`}
          alt={`${username}'s Avatar`}
          className="object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col space-y-6">
        <Link href="/game">
          <Button className="*:inline-block flex justify-center items-center gap-x-3">
            <span>
              <PlayIcon size="35" />
            </span>
            <span>Play</span>
          </Button>
        </Link>
        <Link href="/leaderboard">
          <Button className="*:inline-block flex justify-center items-center gap-x-3">
            <span>
              <BarChart2Icon size="35" />
            </span>
            <span>Leaderboard</span>
          </Button>
        </Link>
      </div>
      <div className="text-center text-base">
        Made with ❤️ by Mrinmoy Mondal
      </div>
    </div>
  );
}
