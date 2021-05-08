import { dedupExchange, Exchange, fetchExchange } from "urql";
import { Cache, cacheExchange } from "@urql/exchange-graphcache";
import { MeDocument } from "../generated/graphql";
import { devtoolsExchange } from "@urql/devtools";
import { isServer } from "./isServer";
import { pipe, tap } from "wonka";
import Router from "next/router";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login");
      }
    })
  );
};

const invalidatePosts = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "posts", fi.arguments || {});
  });
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
    console.log(ctx?.req?.headers.cookie)
  }
  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      devtoolsExchange,
      cacheExchange({
        updates: {
          Mutation: {
            unfriend: (_result, _args, cache, _info) => {
              cache.invalidate("Query", "friends");
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "profile"
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "profile", fi.arguments || {});
              });
            },
            sendFriendRequest: (_result, _args, cache, _info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "profile"
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "profile", fi.arguments || {});
              });
            },
            respond: (_result, _args, cache, _info) =>
              cache.invalidate("Query", "friendRequests"),
            createPost: (_result, _args, cache, _info) =>
              invalidatePosts(cache),
            comment: (_result, _args, cache, _info) => invalidatePosts(cache),
            vote: (_result, _args, cache, _info) => invalidatePosts(cache),
            logout: (_result: any, _, cache) => {
              cache.updateQuery({ query: MeDocument }, (_: any) => {
                return { me: null };
              });
            },
            login: (_result: any, _, cache) => {
              cache.updateQuery({ query: MeDocument }, (data: any) => {
                if (_result.login.errors) {
                  return data;
                } else {
                  return {
                    me: _result.login.user,
                  };
                }
              });
              invalidatePosts(cache);
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
