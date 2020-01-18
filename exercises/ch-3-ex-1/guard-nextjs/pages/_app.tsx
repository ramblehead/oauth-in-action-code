// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable react/jsx-props-no-spreading */

import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  Provider,
} from 'react';

import { AppProps } from 'next/app';
// import App, { AppContext, AppInitialProps, AppProps } from 'next/app';

import AppSession from '../session';

interface AppSessionRef {
  current: AppSession;
}

const AppSessionContext =
  createContext<AppSessionRef>(null as unknown as AppSessionRef);

function GateApp({ Component, pageProps }: AppProps): JSX.Element {
  const [appSessionRef] = useState(
    (): AppSessionRef => ({ current: null as unknown as AppSession }),
  );

  appSessionRef.current = new AppSession({
    count: useState(AppSession.countInit),
  });

  return (
    <AppSessionContext.Provider value={appSessionRef}>
      <Component {...pageProps} />
    </AppSessionContext.Provider>
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
