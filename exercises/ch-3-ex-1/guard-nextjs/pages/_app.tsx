// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { AppProps } from 'next/app';
// import App, { AppContext, AppInitialProps, AppProps } from 'next/app';

import { GateRefContextProvider } from '../models/gate';

function GateApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <GateRefContextProvider>
      <Component {...pageProps} />
    </GateRefContextProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// GateApp.getInitialProps = async (
//   appContext: AppContext,
// ): Promise<AppInitialProps> => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps };
// };

export default GateApp;
