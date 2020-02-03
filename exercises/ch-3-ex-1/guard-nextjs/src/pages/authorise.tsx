// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable dot-notation */

import React, {
  FormEvent,
  useState,
  ChangeEvent,
} from 'react';
import PropTypes from 'prop-types';

// import fetch from 'unfetch';
// import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';
import absoluteUrl from 'next-absolute-url';

import { NextPage } from 'next';
// import { useRouter } from 'next/router';
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
  // const router = useRouter();

  const [state, setState] = useState<State>({
    scopesSelection: scopesSelectionInitial,
  });

  if(error) return (
    <NextError
      statusCode={error.status}
      title={error.statusText}
    />
  );

  const submitApproveHandler = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const approveQuery = {
      scopesSelection: state.scopesSelection,
      approval: 'approved',
    };

    const { origin } = absoluteUrl();
    const path = `${origin}/api/approve`;
    const approveRespRaw = await fetch(path, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(approveQuery),
    });
    const approveResp = await approveRespRaw.json();

    console.log(path, approveResp);
    console.log('approve', state);
  };

  const denyOnClickHandler = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    console.log('deny', state);
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
      <p><b>ID:</b> <code>{requestId}</code></p>
      <form onSubmit={submitApproveHandler}>
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
        <button type="submit">Approve</button>
        <button type="button" onClick={denyOnClickHandler}>Deny</button>
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
