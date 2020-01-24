// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/ban-ts-ignore */

import React, { useContext } from 'react';

import fetch from 'unfetch';
import useSWR from 'swr';

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Error from 'next/error';

import { querySchema, Query } from './api/authorise';

import { AppSessionRefContext } from '../session';

const Authorise: NextPage = () => {
  const { current: appSession } = useContext(AppSessionRefContext);
  const router = useRouter();

  const query = router.query as Query;
  const queryIsValid = querySchema.isValidSync(query, { strict: true });

  const forward = `/api${router.asPath}`;
  const { data, error } = useSWR(
    queryIsValid ? forward : null,
    (url: string) => fetch(url).then((res) => {
      if(res.status > 200) throw res.status;
      return res.json();
    }),
  );

  if(!queryIsValid) return (
    <Error statusCode={404} title={`Incorrect ${router.pathname} query`} />
  );

  if(error) return <Error statusCode={error} />;

  const client = query.client_id;

  return (
    <div>
      <p>{JSON.stringify(appSession.getClient(client))}</p>
      <p>{client}</p>
      <p>{router.asPath}</p>
      <p>{JSON.stringify(query)}</p>
      <p>error: {JSON.stringify(error)}</p>
      <p>data: {JSON.stringify(data)}</p>
    </div>
  );
};

export default Authorise;
