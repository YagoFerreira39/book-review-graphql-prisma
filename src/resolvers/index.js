import { extractFragmentReplacements } from "prisma-binding";
import Query from "./Query";
import Mutation from "./Mutation";
import User from "./User";
import Book from "./Book";
import Author from "./Author";
import Group from "./Group";

const resolvers = {
  Query,
  Mutation,
  User,
  Book,
  Author,
  Group,
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
