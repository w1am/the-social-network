import express from "express";
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { COOKIE_NAME, COOKIE_PASSWORD, __prod__ } from "./constants";
import { GreetResolver } from "./resolvers/greet";
import { PostResolver } from "./resolvers/post";
import path from 'path';
import { VoteResolver } from "./resolvers/vote";
import { CommentResolver } from "./resolvers/comment";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "social",
    username: "postgres",
    password: "password",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [path.join(__dirname, '/entities/**')],
  });

  const RedisStore = connectRedis(session)
  const redis = new Redis();

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: COOKIE_PASSWORD,
      resave: false,
    })
  );

  app.get("/", (_, res) => res.render("<h1>Hello from Server</h1>"));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, CommentResolver, GreetResolver, VoteResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => console.log(`App listening in port 4000`));
};

main().catch((err) => {
  console.log("Something wrong occurred on the server");
  console.error(err);
});