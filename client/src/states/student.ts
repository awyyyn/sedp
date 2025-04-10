import { atom } from "jotai";

import { Student } from "@/types";

export const studentAtom = atom<Student>(null!);
