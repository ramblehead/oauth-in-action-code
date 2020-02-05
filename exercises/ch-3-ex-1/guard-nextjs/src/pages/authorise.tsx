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
import NextError from 'next/error';

import {
  AuthoriseInput,
  AuthoriseOutput,
  Query,
  authoriseOutputSchema,
  querySchema,
} from '../shared/authorise';

import {
  ApproveInput,
} from '../shared/approve';

const propTypes = {
  requestId: PropTypes.string.isRequired,
  responseType: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  scopeSelectionInitial:
    PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  state: PropTypes.string.isRequired,
  error: PropTypes.shape({
    status: PropTypes.number.isRequired,
    statusText: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  error: undefined,
};

type Props = PropTypes.InferProps<typeof propTypes>;

interface ScopeSelection {
  [ scope: string ]: boolean;
}

interface State {
  scopeSelection: ScopeSelection;
}

const Authorise: NextPage<Props> = (props) => {
  // const { current: appSession } = useContext(AppSessionRefContext);
  // const router = useRouter();

  const [state, setState] = useState<State>({
    scopeSelection: props.scopeSelectionInitial,
  });

  if(props.error) {
    return (
      <NextError
        statusCode={props.error.status}
        title={props.error.statusText}
      />
    );
  }

  const approveSubmitHandler = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const approveInput: ApproveInput = {
      responseType: props.responseType,
      requestId: props.requestId,
      scopeSelection: state.scopeSelection,
      // scopeSelection: { foo: true, bar: false },
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
    const approveOutput = await approveResponse.json();

    console.log(path, approveOutput);
    console.log('approve', state);
  };

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
      <p><b>ID:</b> <code>{props.requestId}</code></p>
      <form onSubmit={approveSubmitHandler}>
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
    requestId: '',
    redirectUri: '',
    scopeSelectionInitial: {},
    state: '',
  };

  if(!queryValid) {
    const invalidQueryErrorMessage = `Invalid query: ${ctx.asPath}`;
    result.error = {
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
    result.error = {
      status: authoriseResponse.status,
      statusText: authoriseResponse.statusText,
    };
    return result;
  }

  const authoriseOutput =
    await authoriseResponse.json() as AuthoriseOutput;

  console.log(authoriseOutput);

  const authoriseOutputValid =
    await authoriseOutputSchema.isValid(authoriseOutput, { strict: true });

  if(!authoriseOutputValid) {
    result.error = {
      status: 502,
      statusText: 'Invalid /api/authorise output',
    };
    return result;
  }

  const scopeSelection: ScopeSelection = {};
  authoriseOutput.authorisedScope.forEach((scope) => {
    scopeSelection[scope] = true;
  });

  result.responseType = authoriseInput.responseType;
  result.requestId = authoriseOutput.requestId;
  result.redirectUri = authoriseInput.redirectUrl;
  result.scopeSelectionInitial = scopeSelection;
  result.state = authoriseInput.state;

  return result;
};

export default Authorise;
