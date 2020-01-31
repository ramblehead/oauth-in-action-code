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

  const requestId = response ? response.request_id : '';
  const scopes = response ? response.scopes : [];

  return (
    <div>
      <h2>Approve this client?</h2>
      <p><b>ID:</b> <code>{query.client_id}</code></p>
      <ul>
        {scopes.map((scope) => (
          <>
            <li key={scope}>
              <input
                type="checkbox"
                name={`scope_${scope}`}
                id={`scope_${scope}`}
                checked
              />
              <label htmlFor={`scope_${scope}`}>{scope}</label>
            </li>
          </>
        ))}
      </ul>
      <form action="/api/approve" method="POST">
        <input type="hidden" name="reqid" value={requestId} />
        <input type="submit" name="approval" value="approved" />
        <input type="submit" name="approval" value="denied" />
      </form>
    </div>
  );
};

export default Authorise;
