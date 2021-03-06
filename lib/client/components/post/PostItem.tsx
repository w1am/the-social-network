import React, { useState } from "react";
import Link from "next/link";
import Reactor from "./Reactor";
import { Post, useVoteMutation } from "../../generated/graphql";
import CommentSection from "./CommentSection";
import gql from "graphql-tag";
import { useGetMe } from "../../utils/useGetMe";

interface PostItemProps {
  post: Post | any;
}

export const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [vote] = useVoteMutation();
  const [open, setOpen] = useState<boolean>(false);

  const { username } = useGetMe();

  return (
    <div className="bg-gray-800 px-3 py-5 mb-3 rounded">
      <Link href="/profile/:username" as={`/profile/${post.user.username}`}>
        <p className="text-gray-500 mb-3 cursor-pointer w-min hover:text-gray-400">
          @{post.user.username}
        </p>
      </Link>
      <p>{post.description}</p>
      <div className="flex">
        <p className="my-3 text-gray-300 mr-2">
          {post.likes} {post.likes > 1 ? "Likes" : "Like"}
        </p>
        <p
          className="my-3 text-gray-300 cursor-pointer hover:underline"
          onClick={() => setOpen(!open)}
        >
          {post.commentators} {post.commentators > 1 ? "Comments" : "Comment"}
        </p>
      </div>
      <div className="flex">
        <Reactor
          onClick={async () =>
            await vote({
              variables: { postId: parseInt(post.id) },
              update: (cache) => {
                const data = cache.readFragment<{
                  id: number;
                  likes: number;
                  status: boolean;
                }>({
                  id: `Post:${post.id}`,
                  fragment: gql`
                    fragment _ on Post {
                      id
                      likes
                      status
                    }
                  `,
                });
                if (data) {
                  cache.writeFragment({
                    id: `Post:${post.id}`,
                    fragment: gql`
                      fragment __ on Post {
                        likes
                        status
                      }
                    `,
                    data: {
                      likes: data.status ? data.likes - 1 : data.likes + 1,
                      status: !data.status,
                    },
                  });
                }
              },
            })
          }
          label={post.status ? "Liked" : "Like"}
        >
          {post.status ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500 my-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 my-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </Reactor>
        <Reactor label="Comment" onClick={() => setOpen(!open)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500 my-auto"
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
        </Reactor>
      </div>
      {open && <CommentSection username={username} postId={post.id} comments={post.comments} />}
    </div>
  );
};

export default PostItem;
