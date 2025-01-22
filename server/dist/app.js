import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { gql } from 'graphql-tag';
import dotenv from 'dotenv';

const resolvers = {
  Query: {
    hello: () => "Hello, world!"
  }
};

const typeDefs = gql`
	type Query {
		hello: String!
	}
`;

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});
(async () => {
  await server.start();
  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        console.log(req.headers);
        return { token: req.headers.token };
      }
    })
  );
  await new Promise(
    (resolve) => httpServer.listen({ port: 4e3 }, resolve)
  );
  console.log(`\u{1F680} Server ready at http://localhost:4000/`);
})();
