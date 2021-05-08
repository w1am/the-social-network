import { useApolloClient } from "@apollo/client";

export const useReloadCache = async () => {
  const apolloServer = useApolloClient()

  await apolloServer.resetStore()
};