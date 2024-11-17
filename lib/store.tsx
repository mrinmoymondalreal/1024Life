import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const UsernameAtom = atomWithStorage<null | string>("username", null);
export const UserIdAtom = atomWithStorage<null | string>("userid", null);
export const HighestScore = atomWithStorage<number>("high_score", 0);
export const currentScore = atom<number>(0);
