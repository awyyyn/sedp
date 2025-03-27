import { atom } from "jotai";

import { Event } from "@/types";

export const eventsAtom = atom<Event[]>([]);

export const eventsTotalAtom = atom(0);
