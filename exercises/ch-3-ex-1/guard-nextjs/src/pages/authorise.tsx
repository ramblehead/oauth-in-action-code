// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable dot-notation */

import React, { FormEvent, useState, ChangeEvent } from 'react';
import PropTypes from 'prop-types';

// import fetch from 'unfetch';
// import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';
import absoluteUrl from 'next-absolute-url';

import { NextPage } from 'next';
import NextError from 'next/error';

import {
  querySchema,
  Query,
  ApiResponse,
} from '../api/authorise';

const propTypes = {
  requestId: PropTypes.string.isRequired,
  scopesSelectionInitial:
    PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  error: PropTypes.shape({
    status: PropTypes.number.isRequired,
    statusText: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  error: undefined,
};

type Props = PropTypes.InferProps<typeof propTypes>;

interface ScopesSelection {
  [ scope: string ]: boolean;
}

interface State {
  scopesSelection: ScopesSelection;
}

const Authorise: NextPage<Props> = ({
  requestId,
  scopesSelectionInitial,
  error,
}) => {
  // const { current: appSession } = useContext(AppSessionRefContext);

  const [state, setState] = useState<State>({
    scopesSelection: scopesSelectionInitial,
  });

  if(error) return (
    <NextError
      statusCode={error.status}
      title={error.statusText}
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

  // <form onSubmit={submitHandler}>
  // <form onSubmit={submitHandler} action="/api/approve" method="POST">
  return (
    <div>
      <h2>Approve this client?</h2>
      <p><b>ID:</b> <code>{requestId}</code></p>
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

Authorise.propTypes = propTypes;

Authorise.defaultProps = defaultProps;

Authorise.getInitialProps = async (ctx): Promise<Props> => {
  const { req, res } = ctx;
  const query = ctx.query as Query;
  const queryValid = querySchema.isValidSync(query, { strict: true });

  const result: Props = {
    requestId: '',
    scopesSelectionInitial: {},
  };

  if(!queryValid) {
    // Respond to server side rendering
    if(req && res) {
      const invalidQueryErrorMessage = `Invalid query: ${req.url}`;
      res.statusMessage = invalidQueryErrorMessage;
      res.statusCode = 404;
      res.end();
      result.error = {
        status: res.statusCode,
        statusText: res.statusMessage,
      };
    }
    return result;
  }

  const { origin } = absoluteUrl(req);

  const path = `${origin}/api${ctx.asPath}`;
  const internRespRaw = await fetch(path);
  const internResp: ApiResponse = await internRespRaw.json();

  const scopesSelection: ScopesSelection = {};
  internResp.scopes.forEach((scope) => {
    scopesSelection[scope] = true;
  });

  result.requestId = internResp.request_id;
  result.scopesSelectionInitial = scopesSelection;

  return result;
};

export default Authorise;
