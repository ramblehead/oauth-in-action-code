// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { FormEvent, useState, ChangeEvent } from 'react';

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

interface ScopesSelection {
  [ scope: string ]: boolean;
}

interface State {
  requestId: string;
  scopesSelection: ScopesSelection;
}

const Authorise: NextPage = () => {
  // const { current: appSession } = useContext(AppSessionRefContext);
  const router = useRouter();

  const query = router.query as Query;
  const queryValid = querySchema.isValidSync(query, { strict: true });

  const path = `/api${router.asPath}`;

  const [state, setState] = useState<State>({
    requestId: '',
    scopesSelection: {},
  });

  const { error: fetchError } = useSWR<InternalResponse, FetchError>(
    queryValid ? path : null,
    (url: string) => fetch(url).then(async (res) => {
      if(res.status > 200) throw new FetchError(res.status, res.statusText);
      const response: InternalResponse = await res.json();
      const requestId = response ? response.request_id : '';
      const scopes = response ? response.scopes : [];
      const scopesSelection: ScopesSelection = {};
      scopes.forEach((scope) => {
        scopesSelection[scope] = true;
      });
      setState({ requestId, scopesSelection });
      return response;
    }),
  );

  if(fetchError) return (
    <NextError
      statusCode={fetchError.status}
      title={fetchError.statusText}
    />
  );

  if(!queryValid) return (
    <NextError
      statusCode={400}
      title={`Invalid query: ${router.pathname}`}
    />
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    console.log(state);
    event.preventDefault();
  };

  const scopeSelectionOnChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, checked } = event.target;
    setState((prevState): State => {
      const newState = { ...prevState };
      newState.scopesSelection = {
        ...prevState.scopesSelection,
        [name]: checked,
      };
      return newState;
    });
  };

  return (
    <div>
      <h2>Approve this client?</h2>
      <p><b>ID:</b> <code>{query.client_id}</code></p>
      <form onSubmit={submitHandler}>
        <ul>
          {Object.entries(state.scopesSelection).map(([scope, selected]) => (
            <li key={scope}>
              <input
                type="checkbox"
                name={scope}
                id={`${scope}Checkbox`}
                checked={selected}
                onChange={scopeSelectionOnChangeHandler}
              />
              <label htmlFor={`${scope}Checkbox`}>{scope}</label>
            </li>
          ))}
        </ul>
        <input type="submit" name="approve" value="Approve" />
        <input type="submit" name="denie" value="Denie" />
      </form>
    </div>
  );
};

export default Authorise;
