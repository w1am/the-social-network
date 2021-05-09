import React from "react";
import List from "../components/friends/List";
import PostList from "../components/post/PostList";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  return (
    <div className="flex flex-row">
      <div className="h-screen w-96 p-3">
        <List />
      </div>

      <div className="h-screen w-full p-3">
        <PostList />
      </div>
    </div>
  );
};

export default withApollo({ ssr: true })(Index);