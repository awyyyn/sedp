import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import { BrowserRouter } from "react-router";
import GlobalSnackbar from "./components/global-snackbar/global-snackbar.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<App />
			<GlobalSnackbar />
		</BrowserRouter>
	</StrictMode>
);
