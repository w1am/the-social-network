import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useLogoutMutation } from '../../generated/graphql';

interface AuthedProps {
  username: ReactNode
}

export const Authed: React.FC<AuthedProps> = ({ username }) => {
  const [,logout] = useLogoutMutation()
  return (
    <div className="flex">
      <Link href="/login">
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
        onClick={() => {
          logout();
        }}
        className="my-auto text-gray-200 bg-red-600 p-3 px-5 hover:text-gray-50 hover:bg-red-500 rounded"
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
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </div>
  );
}

export default Authed