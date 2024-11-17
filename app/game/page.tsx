"use client";

import { useEffect, useRef } from "react";
import "../game.css";
import { cleanUp, initGame } from "@/lib/game/script.js";
import { HomeIcon, RefreshCw, ReplyAllIcon } from "lucide-react";
import Button from "@/components/button";
import { SpringModal } from "@/components/Modal";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

import Link from "next/link";
import {
  currentScore,
  HighestScore,
  UserIdAtom,
  UsernameAtom,
} from "@/lib/store";
import { motion } from "framer-motion";

const quitModalState = atom(false);
const restartModalState = atom(false);
const lostState = atom(false);

function RestartModal() {
  const [isOpen, setIsOpen] = useAtom(restartModalState);

  return (
    <SpringModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h1 className="text-3xl font-black font-doto text-white">
        Are You Sure to Restart
      </h1>
      <div className="py-4 space-x-4">
        <Button onClick={() => location.reload()}>Sure</Button>
        <Button
          onClick={() => setIsOpen(false)}
          className="bg-white text-black"
        >
          Cancel
        </Button>
      </div>
    </SpringModal>
  );
}
function QuitModal() {
  const [isOpen, setIsOpen] = useAtom(quitModalState);

  return (
    <SpringModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h1 className="text-3xl font-black font-doto text-white">
        Are You Sure to Go Back
      </h1>
      <div className="py-4 space-x-4">
        <Link href="/">
          <Button>Sure</Button>
        </Link>
        <Button
          onClick={() => setIsOpen(false)}
          className="bg-white text-black"
        >
          Cancel
        </Button>
      </div>
    </SpringModal>
  );
}
function LostModal() {
  const [isOpen, setIsOpen] = useAtom(lostState);

  return (
    <SpringModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h1 className="text-3xl font-black font-doto text-white text-center">
        You Lost
      </h1>
      <div className="flex justify-center items-center py-5">
        <img
          className="object-contain w-1/2"
          src="./disapointment.webp"
          alt=""
        />
      </div>
      <div className="py-4 space-x-4 flex justify-center">
        <Link href="/">
          <Button className="*:inline-block flex justify-center items-center gap-x-2">
            <span>
              <HomeIcon />
            </span>
            <span>Home</span>
          </Button>
        </Link>
        <Button
          onClick={() => location.reload()}
          className="bg-white text-black *:inline-block flex justify-center items-center gap-x-2"
        >
          <span>
            <ReplyAllIcon />
          </span>
          <span>Replay</span>
        </Button>
      </div>
    </SpringModal>
  );
}

type DebouncedFunction<T extends (...args: any[]) => void> = (
  ...args: Parameters<T>
) => void;

const debounce = <T extends (...args: any[]) => void>(
  mainFunction: T,
  delay: number
): DebouncedFunction<T> => {
  let timer: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};

function pushPerformance(name: string, userid: string, score: number) {
  console.log("hhere");
  fetch("/api/AddPerformance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: name, userId: userid, score }),
  });
}

function Score() {
  const score = useAtomValue(currentScore);
  const prevScore = useRef(score);
  const debouncePerformance = useRef(debounce(pushPerformance, 1000));
  const [hiscore, setHiScore] = useAtom(HighestScore);

  const username = useAtomValue(UsernameAtom);
  const userid = useAtomValue(UserIdAtom);

  useEffect(() => {
    if (score > hiscore) {
      setHiScore(score);
      debouncePerformance.current(username!, userid!, score);
    }
    prevScore.current = score;
  }, [score]);

  return (
    <>
      {score}
      <motion.div key={score} className="scorecard animate-float">
        +{score - prevScore.current}
      </motion.div>
    </>
  );
}

export default function Page() {
  const setQuitModalState = useSetAtom(quitModalState);
  const setRestartModalState = useSetAtom(restartModalState);
  const setLostState = useSetAtom(lostState);

  const setScore = useSetAtom(currentScore);

  setLostState(false);
  setRestartModalState(false);
  setQuitModalState(false);

  useEffect(() => {
    initGame(setLostState, setScore);

    return () => {
      cleanUp.forEach((cb) => cb());
    };
  }, []);

  return (
    <>
      <QuitModal />
      <RestartModal />
      <LostModal />
      <div className="space-y-4">
        <div>
          <div className="flex w-full justify-between items-center gap-x-4">
            <Button
              className="py-4 rounded-md"
              onClick={() => setQuitModalState(true)}
            >
              <HomeIcon />
            </Button>
            <div
              id="scorecard_wrapper"
              className="relative font-doto text-3xl font-black text-white -mt-px"
            >
              Score: <Score />
              <div className="scorecard"></div>
            </div>
            <Button
              onClick={() => setRestartModalState(true)}
              className="rounded-md py-4"
            >
              <RefreshCw />
            </Button>
          </div>
        </div>
        <div id="game-board"></div>
      </div>
    </>
  );
}
