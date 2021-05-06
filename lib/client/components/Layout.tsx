import React, { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = "Social Network" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <Navbar />

    <div className="pt-4 px-32 bg-gray-900 h-screen">{children}</div>
  </div>
);

export default Layout
