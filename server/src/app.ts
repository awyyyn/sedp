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
import { environment } from "./environments/environment.js";
import { GraphQLError } from "graphql";
import { verifyToken } from "./services/jwt.js";
import { AppContext } from "./types/index.js";
import { prisma } from "./services/prisma.js";

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
// console.log(environment.CLIENT_URL);
app.use(
	cors<cors.CorsRequest>({
		// origin: environment.CLIENT_URL,/
		methods: ["GET", "POST", "PATCH", "PUT"],
		origin: function (origin, callback) {
			if (
				origin === environment.CLIENT_URL ||
				!origin ||
				origin == "http://localhost:4000"
			) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(express.json());

// REST endpoints
app.use("/api", routes);

// Ensure we wait for our server to start
(async () => {
	await server.start();

	// GraphQL endpoint
	app.use(
		"/graphql",
		// @ts-ignore
		expressMiddleware(server, {
			context: async ({ req }): Promise<AppContext> => {
				const token = req.headers.authorization?.split(" ")[1];

				if (!token) {
					throw new GraphQLError("UnAuthorized");
				}

				const data = verifyToken(token);

				if (!data) {
					throw new GraphQLError("UnAuthorized");
				}

				return {
					id: data.id,
					email: data.email,
					role: data.role,
					prisma: prisma,
				};
			},
		})
	);

	// Modified server startup
	await new Promise<void>((resolve) =>
		httpServer.listen({ port: environment.PORT }, resolve)
	);
	console.log(`🚀 Server ready at http://localhost:${environment.PORT}/`);
})();
