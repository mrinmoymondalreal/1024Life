"use client";
import { UserIdAtom, UsernameAtom } from "@/lib/store";
import { useAtom, useSetAtom } from "jotai";
import { SpringModal } from "./Modal";
import { useEffect, useRef, useState } from "react";
import Button from "./button";

export default function Check({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useAtom(UsernameAtom);
  const setUserId = useSetAtom(UserIdAtom);
  const [isOpen, setIsOpen] = useState(() => username == null);
  const [error, setError] = useState<null | string>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setIsOpen(username == null), [username]);

  return isOpen ? (
    <SpringModal isOpen={isOpen} setIsOpen={() => {}}>
      <h1 className="text-3xl font-black font-doto text-white">
        Please choose a Username
      </h1>

      <div className="py-4 flex flex-col space-y-4">
        <input
          className="shadow-[3px_3px_0px_black] px-5 py-2 outline-none"
          placeholder="Username"
          ref={inputRef}
        />
        {error && <span className="text-red font-black">{error}</span>}
        <Button
          onClick={async () => {
            const value = inputRef.current?.value;
            if (value?.trim() == "" || value?.trim().length! < 3) {
              setError("Enter valid Username");
              return;
            }

            const response = await fetch("/api/AddUser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: value }),
            });

            // console.log("TAG", response.json().then(console.log));
            const result = await response.json();
            if (response.ok && value) {
              setUserId(result.data.insertedId);
              setUsername(value);
              // alert('Data added successfully!');
            } else {
              alert("Error: " + result.message);
            }
          }}
          className="bg-white text-black"
        >
          Enter
        </Button>
      </div>
    </SpringModal>
  ) : (
    children
  );
}
