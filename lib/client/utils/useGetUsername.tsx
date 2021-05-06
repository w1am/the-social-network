import { useRouter } from "next/router";

export const useGetUsername = () => {
  const router = useRouter();
  const username = router.query.username ? router.query.username.toString() : "";

  return username;
};
