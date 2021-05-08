import React from "react";
import List from "../components/friends/List";
import PostList from "../components/post/PostList";
import { useNewFriendNotificationSubscription } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";
import { store } from 'react-notifications-component';

const Index = () => {
  const { data: notificationData } = useNewFriendNotificationSubscription()

  if (notificationData) {
    store.addNotification({
      title: notificationData.newFriendNotification?.username,
      message: `${notificationData.newFriendNotification?.username} sent you a friend request`,
      type: "default",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true
      }
    });
  }

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