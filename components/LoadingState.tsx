"use client";

import { motion } from "framer-motion";
import { useTransitionState } from "next-transition-router";

export default function LoadingState() {
  const { stage } = useTransitionState();

  return (
    <>
      {new Array(5).fill(0).map((_, i) => (
        <motion.div
          key={i}
          transition={{ duration: 0.1, delay: 0.05 * i }}
          animate={
            stage == "leaving"
              ? { x: "0%" }
              : { x: i % 2 == 0 ? "-100%" : "100%" }
          }
          className="bg-red-500 w-full h-[21%] fixed inset-0 z-[99]"
          style={{ top: `${i * 20}%` }}
        ></motion.div>
      ))}
      <motion.div
        animate={
          stage == "leaving"
            ? { opacity: 1, display: "block" }
            : { opacity: 0, display: "none", transition: { delay: 0 } }
        }
        transition={{ delay: 0.3 }}
        className="fixed top-1/2 left-1/2 z-[100] w-[90%] md:w-fit h-fit -translate-x-1/2 -translate-y-1/2"
      >
        <img
          src={`./loading ${Math.floor(Math.random() * 6)}.webp`}
          alt="animated emoji"
        />
      </motion.div>
    </>
  );
}
