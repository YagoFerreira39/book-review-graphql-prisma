import { GraphQLServer } from "graphql-yoga";
import prisma from "./prisma";
import { resolvers } from "./resolvers/index";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context(request) {
    return {
      request,
      prisma,
    };
  },
});

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log("Server's running wild...");
});
