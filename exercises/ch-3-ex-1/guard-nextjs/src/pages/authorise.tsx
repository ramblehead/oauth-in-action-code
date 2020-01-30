// Hey Emacs, this is -*- coding: utf-8 -*-

import React from 'react';
// import React, { useContext } from 'react';

import fetch from 'unfetch';
import useSWR from 'swr';

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import NextError from 'next/error';

import {
  querySchema,
  Query,
  InternalResponse,
} from '../api/authorise';

// import { AppSessionRefContext } from '../session';

class FetchError extends Error {
  name = 'FetchError';

  constructor(
    public status: number,
    public statusText: string,
  ) {
    super(statusText);
    if(Error.captureStackTrace) Error.captureStackTrace(this, FetchError);
  }
}

const Authorise: NextPage = () => {
  // const { current: appSession } = useContext(AppSessionRefContext);
  const router = useRouter();

  const query = router.query as Query;
  const queryValid = querySchema.isValidSync(query, { strict: true });

  const path = `/api${router.asPath}`;

  const { data: response, error } = useSWR<InternalResponse, FetchError>(
    queryValid ? path : null,
    (url: string) => fetch(url).then((res) => {
      if(res.status > 200) throw new FetchError(res.status, res.statusText);
      return res.json();
    }),
  );

  if(!queryValid) return (
    <NextError
      statusCode={400}
      title={`Invalid query: ${router.pathname}`}
    />
  );

  if(error) return (
    <NextError
      statusCode={error.status}
      title={error.statusText}
    />
  );

  // const client = query.client_id;
  //
  // return (
  //   <div>
  //     <p>{JSON.stringify(appSession.getClient(client))}</p>
  //     <p>{client}</p>
  //     <p>{router.asPath}</p>
  //     <p>{JSON.stringify(query)}</p>
  //     <p>error: {JSON.stringify(error)}</p>
  //     <p>data: {JSON.stringify(response)}</p>
  //   </div>
  // );

  const requestId = response ? response.request_id : '';
  // const scope = response ? response.scope : [];

  return (
    <div>
      <h2>Approve this client?</h2>
      <p><b>ID:</b> <code>{query.client_id}</code></p>
      <form action="/approve" method="POST">
        <input type="hidden" name="reqid" value={requestId} />
        <input type="submit" name="approve" value="Approve" />
        <input type="submit" name="deny" value="Deny" />
      </form>
    </div>
  );


  // {scope.map((id) => (
  //   <>
  //     <li key={id}}>
  //       <b>:</b> {client.id}
  //     </li>
  //   </>
  // ))}
  //
};

export default Authorise;
