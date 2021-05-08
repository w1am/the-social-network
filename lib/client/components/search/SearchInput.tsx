import React, { useState } from "react";
import { useSearchQuery } from "../../generated/graphql";
import Link from "next/link";
import { useRouter } from "next/router";

interface SearchInputProps {}

export const SearchInput: React.FC<SearchInputProps> = ({}) => {
  const [value, setValue] = useState("");
  const [toggled, setToggle] = useState(false);
  const { data, loading } = useSearchQuery({
    variables: {
      query: value,
    },
  });

  const router = useRouter();

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading && data?.search && data?.search.length > 0 && toggled) {
            router.push("/profile/" + data.search[0].username);
            setToggle(false)
          }
        }}
        className="relative"
      >
        <input
          className="bg-gray-700 text-gray-100 border border-gray-600 h-12 px-4 rounded-lg text-lg focus:outline-none w-96"
          name="search"
          placeholder="Search"
          autoComplete="off"
          onChange={(e) => {
            setValue(e.target.value);
            setToggle(true);
          }}
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

      {!loading && data?.search && toggled && (
        <div className="bg-white absolute w-full">
          {data.search.map((user) => (
            <Link href="/profile/:username" as={`/profile/${user.username}`}>
              <div
                onClick={() => {
                  setToggle(false);
                }}
                className="shadow-lg cursor-pointer p-3 bg-gray-900 border-2 border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition ease-in-out duration-100"
                key={user.id}
              >
                <p className="text-gray-200">@{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
