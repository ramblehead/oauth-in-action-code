// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/ban-ts-ignore */

import React, { useContext } from 'react';

import fetch from 'unfetch';
import useSWR from 'swr';

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import NextError from 'next/error';

import {
  querySchema,
  Query,
} from './api/authorise';

import { AppSessionRefContext } from '../session';

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
  const { current: appSession } = useContext(AppSessionRefContext);
  const router = useRouter();

  const query = router.query as Query;
  const queryValid = querySchema.isValidSync(query, { strict: true });

  const path = `/api${router.asPath}`;

  const { data: response, error } = useSWR(
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

  // if(response) {
  //   const responseId = response as ResponseId;
  //   if(responseId.id === 'error') {
  //     const responseError = response as ResponseError;
  //
  //     const responseErrorValid =
  //       responseErrorSchema.isValidSync(responseError, { strict: true });
  //     if(!responseErrorValid) return (
  //       <div>
  //         <p>{`Invalid response: ${JSON.stringify(responseError)}`}</p>
  //       </div>
  //     );
  //
  //     return (
  //       <div>
  //         <p>{responseError.error_message}</p>
  //       </div>
  //     );
  //   }
  // }

  const client = query.client_id;

  return (
    <div>
      <p>{JSON.stringify(appSession.getClient(client))}</p>
      <p>{client}</p>
      <p>{router.asPath}</p>
      <p>{JSON.stringify(query)}</p>
      <p>error: {JSON.stringify(error)}</p>
      <p>data: {JSON.stringify(response)}</p>
    </div>
  );
};

export default Authorise;
