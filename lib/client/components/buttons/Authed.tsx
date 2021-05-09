import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useLogoutMutation, useNewFriendNotificationSubscription } from '../../generated/graphql';
import { useApolloClient } from '@apollo/client';

interface AuthedProps {
  username: ReactNode
}

export const Authed: React.FC<AuthedProps> = ({ username }) => {
  const [logout, { loading }] = useLogoutMutation()
  const apolloServer = useApolloClient()
  const { data: notificationData } = useNewFriendNotificationSubscription()

  return (
    <div className="flex">
      <Link href="/notifications">
        <button className="my-auto text-gray-200 mr-4 bg-gray-700 p-3 px-5 hover:text-gray-50 hover:bg-gray-600 rounded">
          <div className="relative">
            {
              (notificationData) && (
                <span className="flex h-3 w-3 absolute -top-1 -right-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )
            }
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </button>
      </Link>
      <Link href="/profile/[username]" as={`/profile/${username}`}>
        <button className="my-auto text-gray-200 mr-4 bg-gray-700 p-3 px-5 hover:text-gray-50 hover:bg-gray-600 rounded">
          {username}
        </button>
      </Link>
      <Link href="/create-post">
        <button className="my-auto text-gray-200 mr-4 bg-gray-700 p-3 px-5 hover:text-gray-50 hover:bg-gray-600 rounded">
          Create Post
        </button>
      </Link>
      <button
        onClick={async () => {
          await logout();
          await apolloServer.resetStore();
        }}
        className="my-auto text-gray-200 bg-red-600 p-3 px-5 hover:text-gray-50 hover:bg-red-500 rounded"
      >
        {loading ? (
          "Load"
        ) : (
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default Authed