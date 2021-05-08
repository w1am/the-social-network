import React from "react";
import { usePostsQuery } from "../../generated/graphql";
import Submit from "../buttons/Submit";
import PostItem from "./PostItem";

interface PostListProps {
  userId?: number;
}

export const PostList: React.FC<PostListProps> = ({ userId }) => {
  const { loading, data, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 5,
      cursor: null,
      userId,
    },
    notifyOnNetworkStatusChange: true
  });

  return (
    <div className="mt-8">
      <h1 className="page-header">Posts</h1>
      {loading && !data ? (
        <p className="text-gray-400">
          No has has posted on the social network yet. Click create post to be
          the first one!
        </p>
      ) : (
        <div>
          {data!.posts.map((post) => (
            <PostItem post={post} key={post.id} />
          ))}
          <Submit
            separator={true}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              fetchMore({
                variables: {
                  limit: variables!.limit,
                  cursor: parseInt(data!.posts[data!.posts.length - 1].id),
                  userId: variables?.userId,
                },
              });
            }}
            label="Load more"
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default PostList;
