import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import { BrowserRouter } from "react-router";
import GlobalSnackbar from "./components/global-snackbar/global-snackbar.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
	uri: import.meta.env.VITE_API_URL!,
	cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ApolloProvider client={client}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<BrowserRouter>
					<App />
					<GlobalSnackbar />
				</BrowserRouter>
			</LocalizationProvider>
		</ApolloProvider>
	</StrictMode>
);
