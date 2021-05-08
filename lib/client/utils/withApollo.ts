import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { NextPageContext } from "next";
import { createWithApollo } from './createWithApollo';
import { isServer } from "./isServer";

const wsLink = process.browser ? new WebSocketLink({
  uri: 'ws://localhost:4000/subscriptions',
  options: {
    lazy: true,
    timeout: 300000,
    reconnect: true
  }
}) : null;

const httplink = new HttpLink({
	uri: 'http://localhost:4000/graphql',
	credentials: 'include'
});

const link = process.browser ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink as any,
  httplink,
) : httplink;

const client = (ctx: NextPageContext) => new ApolloClient({
  link,
  headers: {
    cookie: (isServer() ? ctx?.req?.headers?.cookie : undefined) || ''
  },
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            merge(existing = [], incoming) {
              console.log(existing, incoming)
              return [...existing, ...incoming];
            },
          }
        }
      }
    }
  })
});

export const withApollo = createWithApollo(client)