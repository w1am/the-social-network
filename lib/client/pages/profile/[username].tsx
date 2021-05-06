import React from "react";
import Wrapper from "../../components/Wrapper";
import {
  useSendFriendRequestMutation,
  useUnfriendMutation,
} from "../../generated/graphql";
import { useGetProfile } from "../../utils/useGetProfile";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsAuth } from "../../utils/isAuth";
import Submit from "../../components/buttons/Submit";
import Link from 'next/link';

interface ProfileProps {}

export const ProfilePage: React.FC<ProfileProps> = ({}) => {
  const [{ data }] = useGetProfile();
  const [ { fetching }, sendFriendRequest] = useSendFriendRequestMutation();
  const profile = useIsAuth();
  const [{ fetching: unfriending }, unfriend] = useUnfriendMutation();

  return (
    <Wrapper size="lg">
      {!data ? (
        <p>No profile</p>
      ) : !data.profile ? (
        <p>No profile</p>
      ) : (
        <div>
          <div className="border-b pb-8 border-gray-800">
            <img style={{
              objectFit: 'cover',
              height:"200px",
              width: '100%'
            }} className="rounded-lg" src={data.profile.banner} alt="" />
            <p className="text-center -mt-24">
              <img
                className="inline-block h-32 w-32 rounded-full ring-2 ring-white mb-3"
                src={data.profile.avatar}
                alt=""
              />
            </p>
            <p className="text-3xl text-center">
              {data.profile.username}
            </p>
            <p className="text-center italic text-gray-600 mt-2">{data.profile?.intro}</p>
            {profile?.me?.username !== data?.profile.username && (
              <div className="mt-5">
                <Submit
                  loading={fetching}
                  label="Send friend request"
                  onClick={async () => {
                    if (data?.profile.id) {
                      await sendFriendRequest({
                        recipient: data?.profile.id,
                      });
                    }
                  }}
                >
                  Send friend request
                </Submit>
              </div>
            )}
          </div>
          <div className="mt-8">
            <h1 className="page-header">
              Friends ({data.profile.friends.length})
            </h1>
            {data.profile.friends.map((friend) => (
              <div
                key={friend.friendId}
                className="flex justify-between bg-gray-800 p-3 mb-3 rounded-md last:mb-0"
              >
                <Link
                  href="/profile/:username"
                  as={`/profile/${friend.username}`}
                >
                  <p className="my-auto">@{friend.username}</p>
                </Link>

                <div className="my-auto">
                  <Submit
                    size="xs"
                    onClick={async () =>
                      await unfriend({ recipient: friend.friendId })
                    }
                    loading={unfriending}
                    label="Unfriend"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ProfilePage);
