import { useState } from "react";
import Submit from "../components/buttons/Submit";
import Wrapper from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [pagination, setPagination] = useState({ limit: 3, cursor: 3 });
  const [{ fetching, data }] = usePostsQuery({ variables: pagination });
  return (
    <Wrapper size="lg">
      <h1 className="page-header">Posts</h1>
      {fetching
        ? null
        : data?.posts?.length == 0
        ? null
        : data?.posts?.map((post) => (
            <div className="bg-gray-800 px-3 py-5 mb-3 rounded" key={post.id}>
              <p>{post.description}</p>
            </div>
          ))}
      <Submit
        onClick={() => {
          setPagination({
            limit: pagination.limit + 3,
            cursor: pagination.cursor + 3
          });
        }}
        label="Load more"
        loading={fetching}
      />
    </Wrapper>
  );
};

export default Index;
