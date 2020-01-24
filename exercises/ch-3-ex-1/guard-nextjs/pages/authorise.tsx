// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { useContext } from 'react';

import fetch from 'unfetch';
import useSWR from 'swr';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { querySchema, Query } from './api/authorise';

import { AppSessionRefContext } from '../session';

const Authorise: NextPage = () => {
  const { current: appSession } = useContext(AppSessionRefContext);
  const router = useRouter();

  const query = router.query as Query;
  const queryIsValid = querySchema.isValidSync(query, { strict: true });

  const api = `/api${router.asPath}`;
  const { data, error } = useSWR(
    queryIsValid ? api : null,
    (url: string) => fetch(url).then((res) => {
      if(res.status !== 200) throw res.status;
      return res.json();
    }),
  );

  if(!queryIsValid) return (
    <div>
      <p>
        Incorrect {router.pathname} query:
        <br />
        {JSON.stringify(query)}
      </p>
    </div>
  );

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
