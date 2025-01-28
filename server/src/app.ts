// npm install @apollo/server express graphql cors
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { typeDefs, resolvers } from "./graphql/index.js";
import dotenv from "dotenv";
import { routes } from "./routes/index.js";

interface MyContext {
	token?: string;
}

// Initialize an app and an httpServer
dotenv.config();
const app = express();
const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer<MyContext>({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Health check endpoint
app.get("/healthz", (_, res) => {
	res.send("ok");
});

// Middlewares
app.use(cors<cors.CorsRequest>());
app.use(express.json());

// REST endpoints
app.use("/", routes);

// Ensure we wait for our server to start
(async () => {
	await server.start();

	// GraphQL endpoint
	app.use(
		"/graphql",
		// @ts-ignore
		expressMiddleware(server, {
			context: async ({ req }) => {
				console.log(req.headers);
				return { token: req.headers.token };
			},
		})
	);

	// Modified server startup
	await new Promise<void>((resolve) =>
		httpServer.listen({ port: 4000 }, resolve)
	);
	console.log(`🚀 Server ready at http://localhost:4000/`);
})();
