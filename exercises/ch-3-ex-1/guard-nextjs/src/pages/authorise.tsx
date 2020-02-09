// Hey Emacs, this is -*- coding: utf-8 -*-

// http://localhost:3000/authorise?response_type=code&client_id=oauth-client-1&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2Fcallback&scope=foo%20bar&state=123

/* eslint-disable dot-notation */
/* eslint-disable react/no-unused-prop-types */

import React, {
  FormEvent,
  useState,
  ChangeEvent,
} from 'react';

import PropTypes from 'prop-types';

import fetch from 'isomorphic-unfetch';
import absoluteUrl from 'next-absolute-url';

import { NextPage } from 'next';
// import Router from 'next/router';
import NextError from 'next/error';

import {
  AuthoriseInput,
  AuthoriseOutput,
  authoriseOutputSchema,
} from '../shared/authorise';

import {
  AuthorisationEndpointRequest as Query,
  authorisationEndpointRequestSchema as querySchema,
} from '../shared/queries';

import {
  ApproveInput,
  ApproveOutput,
  approveOutputSchema,
} from '../shared/approve';

const propTypes = {
  authoriseInputId: PropTypes.string.isRequired,
  responseType: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  scopeSelectionInitial:
    PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  state: PropTypes.string.isRequired,
  errorInitial: PropTypes.shape({
    status: PropTypes.number.isRequired,
    statusText: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  errorInitial: undefined,
};

type Props = PropTypes.InferProps<typeof propTypes>;
type Error = Props['errorInitial'];

interface ScopeSelection {
  [ scope: string ]: boolean;
}

interface State {
  scopeSelection: ScopeSelection;
  error: Error;
}

const approveSubmitHandler = async (
  event: FormEvent<HTMLFormElement>,
  props: Props,
  state: State,
  setState: (value: (prevState: State) => State) => void,
): Promise<void> => {
  event.preventDefault();

  const selectedScope =
    Object.entries(state.scopeSelection).reduce<string[]>(
      (prev, cur) => {
        if(cur[1] === true) prev.push(cur[0]);
        return prev;
      }, [],
    );

  const approveInput: ApproveInput = {
    responseType: props.responseType,
    authoriseInputId: props.authoriseInputId,
    selectedScope,
    state: props.state,
    approval: 'approved',
  };

  const { origin } = absoluteUrl();
  const path = `${origin}/api/approve`;
  const approveResponse = await fetch(path, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(approveInput),
  });

  if(approveResponse.status > 200) {
    setState((prevState): State => {
      const newState = { ...prevState };
      newState.error = {
        status: approveResponse.status,
        statusText: approveResponse.statusText,
      };
      return newState;
    });
    return;
  }

  const approveOutput: ApproveOutput = await approveResponse.json();

  const approveOutputValid =
    await approveOutputSchema.isValid(approveOutput, { strict: true });
  if(!approveOutputValid) {
    setState((prevState): State => {
      const invalidApproveOutputErrorMessage = 'Invalid /api/approve Output';
      const newState = { ...prevState };
      newState.error = {
        status: 502,
        statusText: invalidApproveOutputErrorMessage,
      };
      return newState;
    });
    return;
  }

  setTimeout(() => { window.location.href = approveOutput.responseUrl; }, 0);
};

const Authorise: NextPage<Props> = (props) => {
  const [state, setState] = useState<State>({
    scopeSelection: props.scopeSelectionInitial,
    error: props.errorInitial,
  });

  if(state.error) {
    return (
      <NextError
        statusCode={state.error.status}
        title={state.error.statusText}
      />
    );
  }

  const denyOnClickHandler = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    console.log('denied', state);
  };

  const scopeSelectionOnChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, checked } = event.target;
    setState((prevState): State => {
      const newState = { ...prevState };
      newState.scopeSelection = {
        ...prevState.scopeSelection,
        [name]: checked,
      };
      return newState;
    });
  };

  return (
    <div>
      <h2>Approve this client?</h2>
      <p><b>ID:</b> <code>{props.authoriseInputId}</code></p>
      <form
        onSubmit={(event): void => {
          approveSubmitHandler(event, props, state, setState);
        }}
      >
        <ul>
          {Object.entries(state.scopeSelection).map(([scope, selected]) => (
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
  const { req } = ctx;
  const query = ctx.query as Query;
  const queryValid = await querySchema.isValid(query, { strict: true });

  const result: Props = {
    responseType: '',
    authoriseInputId: '',
    redirectUri: '',
    scopeSelectionInitial: {},
    state: '',
  };

  if(!queryValid) {
    const invalidQueryErrorMessage = `Invalid query: ${ctx.asPath}`;
    result.errorInitial = {
      status: 404,
      statusText: invalidQueryErrorMessage,
    };
    return result;
  }

  const authoriseInput: AuthoriseInput = {
    responseType: query.response_type,
    clientId: query.client_id,
    redirectUrl: query.redirect_uri,
    requestedScope: query.scope ? query.scope.split(' ') : [],
    state: query.state,
  };

  const { origin } = absoluteUrl(req);
  const path = `${origin}/api/authorise`;
  const authoriseResponse = await fetch(path, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authoriseInput),
  });

  if(authoriseResponse.status > 200) {
    result.errorInitial = {
      status: authoriseResponse.status,
      statusText: authoriseResponse.statusText,
    };
    return result;
  }

  const authoriseOutput =
    await authoriseResponse.json() as AuthoriseOutput;

  const authoriseOutputValid =
    await authoriseOutputSchema.isValid(authoriseOutput, { strict: true });

  if(!authoriseOutputValid) {
    const invalidAuthoriseOutputErrorMessage = 'Invalid /api/authorise output';
    result.errorInitial = {
      status: 502,
      statusText: invalidAuthoriseOutputErrorMessage,
    };
    return result;
  }

  const scopeSelection: ScopeSelection = {};
  authoriseOutput.authorisedScope.forEach((scope) => {
    scopeSelection[scope] = true;
  });

  result.responseType = authoriseInput.responseType;
  result.authoriseInputId = authoriseOutput.authoriseInputId;
  result.redirectUri = authoriseInput.redirectUrl;
  result.scopeSelectionInitial = scopeSelection;
  result.state = authoriseInput.state;

  return result;
};

export default Authorise;
