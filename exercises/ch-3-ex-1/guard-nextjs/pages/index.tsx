// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { useContext } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';

import { AppSessionRefContext } from '../session';


// import dynamic from 'next/dynamic';
//
// type ProcessTreeModule = typeof import('../components/ProcessTree');
//
// const ProcessTree = dynamic(
//   (): Promise<ProcessTreeModule> => (
//     import('../components/ProcessTree')
//   ),
//   { ssr: false },
// );

const Index: NextPage = () => {
  const { current: appSession } = useContext(AppSessionRefContext);

  return (
    <div>
      <Link href="/about">
        <a href="/about" title="About Page">About Page</a>
      </Link>
      <p>XXX</p>
      <button
        type="button"
        onClick={(_event): void => {
          console.log('Up!');
          appSession.count += 1;
          appSession.update();
        }}
      >
        Up!
      </button>
      <p>Up! Clicks count = {appSession.count}</p>
      <h1>OAuth Authorization Server</h1>
      <h2>Client information:</h2>
      <ul>
        {appSession.clients.map((client) => (
          <>
            <li key="clientId">
              <b>clientId:</b> {client.id}
            </li>
            <li key="clientSecret">
              <b>clientSecret:</b> {client.secret}
            </li>
            <li key="scope">
              <b>scope:</b> {client.scope}
            </li>
            <li key="redirectUris">
              <b>redirectUris:</b> {client.redirectUris}
            </li>
          </>
        ))}
      </ul>
      <h2>Server information:</h2>
      <ul>
        <li key="authorizationEndpoint">
          <b>authorizationEndpoint:</b>
          {appSession.authServer.authorizationEndpoint}
        </li>
        <li>
          <b>tokenEndpoint:</b>
          {appSession.authServer.tokenEndpoint}
        </li>
      </ul>
    </div>
  );
};

export default Index;
