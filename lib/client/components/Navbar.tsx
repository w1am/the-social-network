import React from 'react'
import Link from 'next/link'

export const Navbar: React.FC<{}> = ({}) => {
  return (
    <div className="shadow-md px-8">
      <div className="py-3 flex justify-between border-b-2 border-gray-100">
        <p className="text-gray-800 text-lg font-bold my-auto">
          Social Network
        </p>

        <div className="relative text-gray-600">
          <input
            className="border border-gray-300 h-10 px-4 rounded-lg text-sm focus:outline-none w-96"
            name="search"
            placeholder="Search"
          />
        </div>

        <div className="flex">
          <Link href="/login">
            <p className="my-auto cursor-pointer text-gray-500 hover:text-gray-800 transition duration-500 ease-in-out mr-3">
              Login
            </p>
          </Link>
          <Link href="/register">
            <p className="my-auto cursor-pointer text-gray-500 hover:text-gray-800 transition duration-500 ease-in-out">
              Register
            </p>
          </Link>
        </div>
      </div>

      <div className="py-2 flex">
        <div className="mr-5 inline-block">
          <Link href="/login">
            <button className="sub-navbar-link">Home</button>
          </Link>
        </div>
        <div className="mr-5 inline-block">
          <Link href="/login">
            <button className="sub-navbar-link">Friends</button>
          </Link>
        </div>
        <div className="mr-5 inline-block">
          <Link href="/login">
            <button className="sub-navbar-link">Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar