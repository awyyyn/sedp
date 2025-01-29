import { atom } from "jotai";

interface SnackbarAtomProps {
	open: boolean;
	message: string;
	severity: "success" | "error" | "info" | "warning";
	showIcon?: boolean;
	showCloseButton?: boolean;
}

export const snackbarAtom = atom<SnackbarAtomProps>({
	open: false,
	message: "",
	severity: "success",
	showIcon: true,
	showCloseButton: false,
});
