import React from "react";
import Layout from "../components/Layout";
import { AppProps } from "next/app";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";

import "../styles/index.css";
import { cacheExchange } from "@urql/exchange-graphcache";
import { MeDocument } from "../generated/graphql";
import { devtoolsExchange } from "@urql/devtools";

const progress = new ProgressBar({
  size: 3,
  color: "#1a70e0",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [
    dedupExchange,
    devtoolsExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result: any, _, cache) => {
            cache.updateQuery({ query: MeDocument }, (_: any) => {
              return { me: null }
            })
          },
          login: (_result: any, _, cache) => {
            cache.updateQuery({ query: MeDocument }, (data: any) => {
              if (_result.login.errors) {
                return data
              } else {
                return {
                  me: _result.login.user
                }
              }
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include",
  },
});

export const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider value={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
};

export default MyApp;
