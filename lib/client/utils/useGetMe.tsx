import { useMeQuery } from "../generated/graphql";
import { isServer } from "./isServer";

export const useGetMe = () => {
  const { data } = useMeQuery({ skip: isServer() });
  const me = data?.me
  return {
    id: me?.id,
    username: me?.username
  }
};