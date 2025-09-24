import { atom } from "jotai";

import { AdminNotification, ScholarNotification } from "@/types";

export const scholarNotificationAtom = atom<ScholarNotification[]>([]);

export const adminNotificationAtom = atom<AdminNotification[]>([]);

export const scholarsSentNotificationsAtom = atom<string[]>([]);
