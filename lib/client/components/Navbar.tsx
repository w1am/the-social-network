import React from "react";
import Link from "next/link";
import { useMeQuery } from "../generated/graphql";
import Authed from "./buttons/Authed";

export const Navbar: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useMeQuery()
  return (
    <div className="py-2 flex justify-between bg-gray-800 px-8">
      <div className="flex">
        <Link href="/">
          <div className="bg-gray-700 my-auto mx-auto p-3 rounded-md mr-3 cursor-pointer hover:bg-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-7 text-gray-300 my-auto cursor-pointer transition ease-in-out duration-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
        </Link>

        <form className="relative">
          <input
            className="bg-gray-700 text-gray-100 border border-gray-600 h-12 px-4 rounded-lg text-lg focus:outline-none w-96"
            name="search"
            placeholder="Search"
          />
          <button className="absolute top-3 right-3" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>

      {!fetching && data?.me ? (
        <Authed username={data.me?.username} />
      ) : (
        <div className="flex">
          <Link href="/login">
            <button className="my-auto text-gray-200 bg-blue-600 p-3 px-5 mr-4 hover:text-gray-50 hover:bg-blue-700 rounded">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="my-auto text-gray-200 bg-blue-600 p-3 px-5 hover:text-gray-50 hover:bg-blue-700 rounded">
              Register
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
