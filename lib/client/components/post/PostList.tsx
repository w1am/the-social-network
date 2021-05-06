import React, { useState } from 'react'
import { usePostsQuery } from '../../generated/graphql';
import Submit from '../buttons/Submit';
import PostItem from './PostItem';

interface PostListProps {

}

export const PostList: React.FC<PostListProps> = ({}) => {
  const [pagination, setPagination] = useState({ limit: 10, cursor: 10 });
  const [{ fetching, data }] = usePostsQuery({ variables: pagination });
  return (
    <div className="mt-8">
      <h1 className="page-header">Posts</h1>
      {fetching ? null : data?.posts?.length == 0 || !data?.posts ? (
        <div>
          <p className="text-gray-400">
            No has has posted on the social network yet. Click create post to be
            the first one!
          </p>
        </div>
      ) : (
        <div>
          {data?.posts?.map((post) => (
            <PostItem post={post} key={post.id} />
          ))}
          <Submit
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              setPagination({
                limit: pagination.limit + 3,
                cursor: pagination.cursor + 3,
              });
            }}
            label="Load more"
            loading={fetching}
          />
        </div>
      )}
    </div>
  );
}

export default PostList