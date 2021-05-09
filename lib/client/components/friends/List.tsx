import React, { Fragment } from "react";
import { useFriendsQuery } from "../../generated/graphql";
import Link from "next/link";

interface ListProps {}

export const List: React.FC<ListProps> = ({}) => {
  const { loading: friendsFetching, data: friendsData } = useFriendsQuery();
  return (
    <Fragment>
      {friendsFetching ? null : !friendsData ||
        friendsData.friends.length == 0 ? (
        <div className="mt-8">
          <h1 className="page-header">Friends</h1>
          <div className="bg-gray-800 px-3 py-5 rounded">
            <p>No friends</p>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h1 className="page-header">Friends</h1>
          <div className="bg-gray-800 px-3 py-5 rounded">
            {friendsData.friends.map((friend) => (
              <div
                key={friend.id}
                className="
                    flex cursor-pointer
                    justify-between mb-2
                    last:mb-0 bg-gray-800
                    p-2 py-3 rounded-md
                    hover:bg-gray-700
                    transition ease-in-out duration-100
                  "
              >
                <Link href="/profile/:username" as={`/profile/${friend.user.username}`}>
                  <p className="cursor-pointer w-min my-auto" key={friend.id}>
                    @{friend.user.username}
                  </p>
                </Link>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 cursor-pointer text-gray-400 my-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default List;
