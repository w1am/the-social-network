import React from "react";
import Layout from "../components/Layout";
import { AppProps } from "next/app";

import "../styles/index.css";

export const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
