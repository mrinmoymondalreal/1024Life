"use client";

import Button from "@/components/button";
import { HighestScore, UsernameAtom } from "@/lib/store";
import { atom, useAtomValue } from "jotai";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

function Player({
  no,
  username,
  score,
}: {
  no: number;
  score: number;
  username: string;
}) {
  return (
    <div className="flex w-full justify-evenly items-center h-10 space-x-4">
      <div className="w-[20px]">{no}.</div>
      <div className="bg-gray-500 aspect-square rounded-full h-full">
        <img
          src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`}
          alt={`${username}'s Avatar`}
          className="object-cover rounded-full"
        />
      </div>
      <div className="flex-[2]">{username}</div>
      <div>{score}</div>
    </div>
  );
}

const SELF_RANK_ATOM = atom((get, { signal }) =>
  fetch(`/api/GetUserRank?username=${get(UsernameAtom)}`, {
    signal,
  }).then<number>((e) => e.json())
);

function Self() {
  const hiscore = useAtomValue(HighestScore);
  const username = useAtomValue(UsernameAtom);

  const rank = useAtomValue(SELF_RANK_ATOM);
  // const rank = 800;

  return <Player username={username || "You"} no={rank} score={hiscore} />;
}

const LEADERBOARD_ATOM = atom((get, { signal }) =>
  fetch("/api/Leaderboard", {
    signal,
  }).then<{ username: string; score: number }[]>((e) => e.json())
);

function PlayerList() {
  let list = useAtomValue(LEADERBOARD_ATOM);

  return list.map(({ username, score }, index) => (
    <Player username={username} no={index + 1} score={score} key={index} />
  ));
}

export default function Leaderboard() {
  return (
    <div className="h-screen mx-auto w-full md:w-[80%] font-bold font-doto text-white px-6 py-4">
      <div className="flex items-center gap-x-4">
        <Link href="/">
          <Button className="px-3">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div className="text-3xl font-black">Leaderboard</div>
      </div>
      <div className="mt-6 flex w-full justify-evenly items-center h-10 space-x-4">
        <div className="w-[30px]">No.</div>
        {/* <div className="]"></div> */}
        <div className="flex-[2]">Player Name</div>
        <div>Score</div>
      </div>
      <div className="mt-2 space-y-4 pb-24">
        <PlayerList />
      </div>
      <div className="bg-primary bottom-0 fixed w-full md:w-[80%] py-5 left-0 md:left-1/2 md:-translate-x-1/2 px-5 border-t border-t-white">
        <Self />
      </div>
    </div>
  );
}
