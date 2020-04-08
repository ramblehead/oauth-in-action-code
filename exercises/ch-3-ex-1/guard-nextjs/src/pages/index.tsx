// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { useContext } from 'react';

import fetch from 'unfetch';
import useSWR from 'swr';

import Link from 'next/link';
import NextError from 'next/error';
import { NextPage } from 'next';

import { AppSessionRefContext } from '../client';

const Index: NextPage = () => {
  const { current: appSession } = useContext(AppSessionRefContext);

  const { data: authServer, error: authServerError } = useSWR(
    '/api/authServer',
    (url: string) => fetch(url).then((res) => {
      if(res.status > 200) throw res.status;
      return res.json();
    }),
  );

  if(authServerError) return <NextError statusCode={authServerError} />;

  return (
    <div>
      <Link href="/about">
        <a href="/about" title="About Page">About Page</a>
      </Link>
      <p>Artizanya</p>
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
          {' '}
          {authServer ? authServer.authorizationEndpoint : 'loading...'}
        </li>
        <li key="tokenEndpoint">
          <b>tokenEndpoint:</b>
          {' '}
          {authServer ? authServer.tokenEndpoint : 'loading...'}
        </li>
      </ul>
    </div>
  );
};

export default Index;
