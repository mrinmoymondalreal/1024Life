"use client";

import { TransitionRouter } from "next-transition-router";

export default function Providers({
  children,
}: {
  children?: React.ReactNode;
}) {
  const handleTransition = (next: () => void) => {
    new Promise((res) => setTimeout(res, 1000)).then((e) => {
      next();
    });
  };

  return (
    <TransitionRouter enter={handleTransition} leave={handleTransition} auto>
      {children}
    </TransitionRouter>
  );
}
