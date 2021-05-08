import { useProfileQuery } from "../generated/graphql";
import { isServer } from "./isServer";
import { useGetUsername } from "./useGetUsername";

export const useGetProfile = () => {
  const username = useGetUsername();
  return useProfileQuery({
    variables: {
      username,
    },
    skip: isServer(),
  });
};