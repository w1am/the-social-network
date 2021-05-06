import { withUrqlClient } from "next-urql";
import React from "react";
import Wrapper from "../components/Wrapper";
import { useFriendRequestsQuery, useRespondMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface notificationsProps {}

export const notifications: React.FC<notificationsProps> = ({}) => {
  const [{ fetching, data }] = useFriendRequestsQuery();
  const [ ,respond ] = useRespondMutation()

  if (fetching) {
    return null;
  } else if (!data) {
    return null
  } else {
    return (
      <Wrapper size="sm">
        <h1 className="page-header">Notifications</h1>
        {data.friendRequests.length == 0 ? (
          <div>
            <p className="text-gray-400">
              You don't have any notifications
            </p>
          </div>
        ) : data.friendRequests.map((friend) => (
          <div
            key={friend.id}
            className="flex justify-between bg-gray-800 p-3 rounded-md mb-2"
          >
            <p className="my-auto">{friend.user.username}</p>

            <div>
              <button
                onClick={async () => {
                  await respond({ status: 1, friendId: friend.user.id });
                }}
                className="my-auto mr-2 text-gray-200 bg-green-600 p-1 px-3 hover:text-gray-50 hover:bg-green-500 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>

              <button
                onClick={async () => {
                  await respond({ status: -1, friendId: friend.user.id });
                }}
                className="my-auto text-gray-200 bg-red-600 p-1 px-3 hover:text-gray-50 hover:bg-red-500 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </Wrapper>
    );
  }
};

export default withUrqlClient(createUrqlClient)(notifications);