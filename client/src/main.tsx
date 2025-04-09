import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "sonner";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { client } from "./lib/apollo.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<AuthProvider>
				<BrowserRouter>
					<Provider>
						<App />
						<Toaster />
					</Provider>
				</BrowserRouter>
			</AuthProvider>
		</ApolloProvider>
	</React.StrictMode>
);
