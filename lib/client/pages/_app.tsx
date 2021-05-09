import React, { Fragment } from "react";
import Layout from "../components/Layout";
import { AppProps } from "next/app";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
// import ReactNotification, { store } from 'react-notifications-component';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

import "../styles/index.css";
import { withApollo } from "../utils/withApollo";
// import { useNewFriendNotificationSubscription } from "../generated/graphql";

const progress = new ProgressBar({
  size: 3,
  color: "#1a70e0",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

export const MyApp = ({ Component, pageProps }: AppProps) => {
  // const { data: notificationData } = useNewFriendNotificationSubscription()

  // if (notificationData) {
  //   store.addNotification({
  //     title: notificationData.newFriendNotification?.username,
  //     message: `${notificationData.newFriendNotification?.username} sent you a friend request`,
  //     type: "default",
  //     insert: "top",
  //     container: "top-right",
  //     animationIn: ["animate__animated", "animate__fadeIn"],
  //     animationOut: ["animate__animated", "animate__fadeOut"],
  //     dismiss: {
  //       duration: 5000,
  //       onScreen: true
  //     }
  //   });
  // }

  return (
    <Fragment>
      <ReactNotification />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  );
};

export default withApollo({ ssr: false })(MyApp);