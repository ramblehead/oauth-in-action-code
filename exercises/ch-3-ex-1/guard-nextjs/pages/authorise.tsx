// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { useContext } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { querySchema, Query } from './api/authorise';

import { AppSessionRefContext } from '../session';

const Authorise: NextPage = () => {
  const { current: appSession } = useContext(AppSessionRefContext);
  const router = useRouter();

  const query = router.query as Query;

  const queryIsValid = querySchema.isValidSync(query, { strict: true });
  const client = query.client_id;

  if(!queryIsValid) return (
    <div>
      <p>
        Incorrect {router.pathname} query:
        <br />
        {JSON.stringify(query)}
      </p>
    </div>
  );

  return (
    <div>
      <p>{JSON.stringify(appSession.getClient(client))}</p>
      <p>{client}</p>
      <p>{JSON.stringify(query)}</p>
    </div>
  );
};

export default Authorise;
