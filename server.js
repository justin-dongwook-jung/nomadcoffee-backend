require('dotenv').config()
// import { ApolloServer } from "apollo-server";
import express from "express";
import http from "http";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { graphqlUploadExpress } from "graphql-upload";
import { typeDefs, resolvers } from './schema';
import { getUser } from "./users/users.utils";

const app = express();
app.use(logger("tiny"));
app.use(graphqlUploadExpress());
app.use("/static", express.static("uploads"));

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    }
  },
  plugins: [ ApolloServerPluginDrainHttpServer({httpServer}), ApolloServerPluginLandingPageGraphQLPlayground() ]
})

const PORT = process.env.PORT

server.start().then(() => {
  httpServer.listen({port: PORT}, () => {
    console.log(`🚀 Running on http://localhost:${PORT}`);
  })

  server.applyMiddleware({app, path: '/'});
})
