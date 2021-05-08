import React, { useState } from "react";
import { useCommentMutation } from "../../generated/graphql";
import Link from "next/link";
import gql from "graphql-tag";

interface Comment {
  comment: string;
  username: string;
}

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  username: string | undefined;
}

interface Comment {
  id: number;
  comment: string;
  username: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  postId,
  username
}) => {
  const [comment] = useCommentMutation();
  const [value, setValue] = useState("");
  return (
    <div className={`py-3 pb-0 border-t-2 border-gray-700 mt-4`}>
      <form
        className="relative"
        onSubmit={async (e) => {
          e.preventDefault();
          if (value.trim().length > 0) {
            await comment({
              variables: { comment: value, postId: parseInt(postId) },
              update: (cache) => {
                const data = cache.readFragment<{
                  id: number;
                  comments: [Comment];
                  commentators: number;
                }>({
                  id: `Post:${postId}`,
                  fragment: gql`
                    fragment _ on Post {
                      id
                      commentators
                      comments {
                        id
                        comment
                        username
                      }
                    }
                  `,
                });

                if (data) {
                  cache.writeFragment({
                    id: `Post:${postId}`,
                    fragment: gql`
                      fragment _ on Post {
                        commentators
                        comments
                      }
                    `,
                    data: {
                      commentators: data.commentators + 1,
                      comments: [
                        ...data.comments,
                        {
                          id:
                            data.comments.indexOf(
                              data.comments[data.comments.length - 1]
                            ) + 1,
                          comment: value,
                          username,
                        },
                      ],
                    },
                  });
                }
              }
            });
          }
          setValue("");
        }}
      >
        <input
          className="bg-gray-700 mb-3 text-gray-100 border border-gray-600 h-10 px-4 rounded-full text-sm focus:outline-none w-full"
          placeholder="Type a comment"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="absolute right-3 top-0 text-gray-400 h-10 cursor-pointer rounded-full hover:text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </div>
      </form>
      {comments.map(({ comment, username }, index: number) => (
        <div
          key={index}
          className="text-white bg-gray-700 px-4 py-2 rounded-xl w-max mb-2 last:mb-0"
        >
          <Link href="/">
            <p className="text-sm font-semibold cursor-pointer">{username}</p>
          </Link>
          <p className="text-sm">{comment}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
