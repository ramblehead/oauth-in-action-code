// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable react/jsx-props-no-spreading */

import React, {
  useState,
  useCallback,
} from 'react';

import { AppProps } from 'next/app';
// import App, { AppContext, AppInitialProps, AppProps } from 'next/app';

import { appSession, AppSessionRefContext, AppSessionRef } from '../client';

const GateApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [appSessionRef, setModelRef] = useState(
    (): AppSessionRef => ({ current: appSession }),
  );

  const update = useCallback(
    (): void => setModelRef((prevRef: AppSessionRef): AppSessionRef => (
      { current: prevRef.current }
    )),
    [setModelRef],
  );

  useState((): void => appSessionRef.current.setUpdateFunction(update));

  return (
    <AppSessionRefContext.Provider value={appSessionRef}>
      <Component {...pageProps} />
    </AppSessionRefContext.Provider>
  );
};

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
