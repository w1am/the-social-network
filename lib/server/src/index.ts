import "reflect-metadata";
import express from "express";
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, COOKIE_PASSWORD, __prod__ } from "./constants";
import path from 'path';
import { VoteResolver } from "./resolvers/vote";
import { CommentResolver } from "./resolvers/comment";
import { FriendResolver } from "./resolvers/friend";
import { UserResolver } from "./resolvers/user";
import { GreetResolver } from "./resolvers/greet";
import { PostResolver } from "./resolvers/post";
import { RedisPubSub } from 'graphql-redis-subscriptions';
import http from 'http';

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "social",
    username: "postgres",
    password: "password",
    logging: false,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [path.join(__dirname, '/entities/**')],
  });

  const myRedisPubSub = new RedisPubSub();
  const RedisStore = connectRedis(session)
  const redis = new Redis();

  const app = express();
  const httpServer = http.createServer(app)

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true
    })
  );

  const sessionMiddleware = session({
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

  app.use(sessionMiddleware);

  app.get("/", (_, res) => res.render("<h1>Hello from Server</h1>"));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, VoteResolver, PostResolver, FriendResolver, CommentResolver, GreetResolver],
      pubSub: myRedisPubSub,
      validate: false
    }),
    subscriptions: {
      path: "/subscriptions",
      onConnect: (_params, ws: any) => {
        return new Promise(res =>
          sessionMiddleware(ws.upgradeReq, {} as any, () => {
            res({ req: ws.upgradeReq })
          })
        )
      },
      onDisconnect: () => console.log("Client disconnected from subscriptions")
    },
    context: ({ req, res, connection }) => ({
      req,
      res,
      redis,
      connection
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  apolloServer.installSubscriptionHandlers(httpServer)

  httpServer.listen(4000, () => {
    console.log(
      `Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    );
    console.log(
      `Subscriptions ready at ws://localhost:4000${apolloServer.subscriptionsPath}`
    );
  })
};

main().catch((err) => {
  console.log("Something wrong occurred on the server");
  console.error(err);
});