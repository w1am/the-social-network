import React, { useState } from "react";
import Submit from "../components/buttons/Submit";
import PostItem from "../components/post/PostItem";
import Wrapper from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [pagination, setPagination] = useState({ limit: 10, cursor: 10 });
  const [{ fetching, data }] = usePostsQuery({ variables: pagination });
  return (
    <Wrapper size="lg">
      <h1 className="page-header">Posts</h1>
      {fetching
        ? null
        : data?.posts?.length == 0
        ? null
        : data?.posts?.map((post) => <PostItem post={post} key={post.id} />)}
      <Submit
        onClick={(e:React.MouseEvent) => {
          e.preventDefault()
          setPagination({
            limit: pagination.limit + 3,
            cursor: pagination.cursor + 3,
          });
        }}
        label="Load more"
        loading={fetching}
      />
    </Wrapper>
  );
};

export default Index;
