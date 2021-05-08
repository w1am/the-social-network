import React, { useEffect } from "react";
import Wrapper from "../../components/Wrapper";
import {
  ProfileDocument,
  useSendFriendRequestMutation,
  useUnfriendMutation,
  UnfriendMutation,
  SendFriendRequestMutation
} from "../../generated/graphql";
import { useGetProfile } from "../../utils/useGetProfile";
import { useIsAuth } from "../../utils/isAuth";
import Submit from "../../components/buttons/Submit";
import PostList from "../../components/post/PostList";
import { withApollo } from "../../utils/withApollo";
import { ApolloCache } from "@apollo/client";

interface ProfileProps {}

const writeQuery = (
  cache: ApolloCache<SendFriendRequestMutation | UnfriendMutation>,
  username: string,
  association: number
) => {
  cache.writeQuery({
    query: ProfileDocument,
    data: {
      __typename: "Query",
      profile: {
        __typename: "User",
        association,
      },
    },
    variables: {
      username,
    },
  });
};

export const ProfilePage: React.FC<ProfileProps> = ({}) => {
  const { data } = useGetProfile();
  const [sendFriendRequest, { loading }] = useSendFriendRequestMutation();
  const profile = useIsAuth();
  const [unfriend, { loading: unfriending }] = useUnfriendMutation();

  return (
    <Wrapper size="xl">
      {!data ? (
        <p>No profile</p>
      ) : !data.profile ? (
        <p>No profile</p>
      ) : (
        <div>
          <div className="pb-8 border-b border-gray-800">
            <img
              style={{
                objectFit: "cover",
                height: "200px",
                width: "100%",
              }}
              className="rounded-lg"
              src={data.profile.banner}
              alt=""
            />
            <p className="text-center -mt-24">
              <img
                className="inline-block h-32 w-32 rounded-full ring-2 ring-white mb-3"
                src={data.profile.avatar}
                alt=""
              />
            </p>
            <p className="text-3xl text-center">{data.profile.username}</p>
            <p className="text-center italic text-gray-600 mt-2">
              {data.profile?.intro}
            </p>
            {profile?.me?.username !== data?.profile.username && (
              <div className="mt-5">
                <Submit
                  colorScheme={
                    data?.profile.association == 0
                      ? "pending"
                      : data?.profile.association == 1
                      ? "unfriend"
                      : "facebook"
                  }
                  loading={loading || unfriending}
                  label={
                    data?.profile.association == 0
                      ? "Pending"
                      : data?.profile.association == 1
                      ? "Unfriend"
                      : "Send friend request"
                  }
                  onClick={async () => {
                    if (
                      data?.profile.association == 1 ||
                      data?.profile.association == 0
                    ) {
                      if (data?.profile.id) {
                        await unfriend({
                          variables: { recipient: data?.profile.id },
                          update: (cache) =>
                            writeQuery(cache, data.profile.username, -1),
                        });
                      }
                    } else {
                      if (data?.profile.id) {
                        await sendFriendRequest({
                          variables: { recipient: data?.profile.id },
                          update: (cache) =>
                            writeQuery(cache, data.profile.username, 0),
                        });
                      }
                    }
                  }}
                >
                  Send friend request
                </Submit>
              </div>
            )}
          </div>
          <div className="mt-8">
            <PostList userId={data.profile.id} />
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ProfilePage);
