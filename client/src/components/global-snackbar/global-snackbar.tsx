import { Alert, Snackbar } from "@mui/material";
import { useAtom } from "jotai";
import { snackbarAtom } from "../../states";
import { Check, Error, Info, Warning } from "@mui/icons-material";

export default function GlobalSnackbar() {
	const [snackbar, setSnackbar] = useAtom(snackbarAtom);

	const handleClose = () => setSnackbar((p) => ({ ...p, open: false }));

	const getIcon = () => {
		switch (snackbar?.severity) {
			case "success":
				return <Check />;
			case "error":
				return <Error />;
			case "info":
				return <Info />;
			case "warning":
				return <Warning />;
			default:
				return false;
		}
	};

	return (
		<Snackbar
			open={!!snackbar?.open}
			autoHideDuration={5000}
			onClose={handleClose}
			anchorOrigin={{ horizontal: "center", vertical: "top" }}>
			<Alert
				icon={snackbar.showIcon && getIcon()}
				severity={snackbar?.severity}
				onClose={snackbar.showCloseButton ? handleClose : undefined}>
				{snackbar.message}
			</Alert>
		</Snackbar>
	);
}
