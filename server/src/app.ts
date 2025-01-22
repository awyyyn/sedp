import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { expressMiddleware } from "@apollo/server/express4";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs, resolvers } from "./graphql";

// Initialization
const app = express();
dotenv.config();

// Environment Variables
const port = process.env.PORT || 3000;

// Middlewares
// app.use(cors());
// app.use(express.json());
// app.get("/health-check", (_, res) => {
// 	res.send("OK!");
// });

// HTTP Server
const httpServer = http.createServer(app);

// Schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

//
interface MyContext {
	token?: String;
}

// Apollo Server
const server = new ApolloServer<MyContext>({
	schema,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Start Apollo server
await server.start();

// Apollo GraphQL API
app.use("/graphql", cors(), express.json(), expressMiddleware(server, {}));
// console.log("Server is running on port", port);

httpServer.listen(port, () => {
	console.log(`[ ready ] http://localhost:${port}`);
});
