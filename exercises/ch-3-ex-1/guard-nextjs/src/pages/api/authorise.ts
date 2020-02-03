// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';

import {
  serverSession,
  randomStringGenerate,
} from '../../api';

import {
  Query,
  AuthoriseOutput,
  getClient,
  redirectUriValid,
  scopeAllowed,
  querySchema,
} from '../../api/authorise';

const authorise = async (
  req: NextApiRequest,
  res: NextApiResponse<AuthoriseOutput>,
): Promise<void> => {
  if(req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    const methodNotAllowedErrorMessage = `Method ${req.method} Not Allowed`;
    res.statusMessage = methodNotAllowedErrorMessage;
    res.status(405).end();
    return;
  }

  const query = req.query as Query;
  const queryValid = querySchema.isValidSync(query, { strict: true });
  if(!queryValid) {
    const invalidQueryErrorMessage = `Invalid query: ${req.url}`;
    res.statusMessage = invalidQueryErrorMessage;
    res.status(404).end();
    return;
  }

  const client = getClient(query.client_id);

  if(!client) {
    const unknownClientErrorMessage = `Unknown client_id: "${query.client_id}"`;
    res.statusMessage = unknownClientErrorMessage;
    res.status(404).end();
    return;
  }

  const redirectUri = query.redirect_uri;

  if(!redirectUriValid(client, redirectUri)) {
    const invalidRedirectUriErrorMessage =
      `Invalid Redirect URI: "${redirectUri}"`;
    res.statusMessage = invalidRedirectUriErrorMessage;
    res.status(404).end();
    return;
  }

  const scope = query.scope ? query.scope.split(' ') : [];
  if(!scopeAllowed(client, scope)) {
    const invalidRequestedScopeErrorMessage =
      `Invalid Requested Scope: "${query.scope}"`;
    res.statusMessage = invalidRequestedScopeErrorMessage;
    res.status(404).end();
    return;
  }

  const requestId = randomStringGenerate(8);
  serverSession.requests.set(requestId, query);

  res.status(200).json({
    responseType: query.response_type,
    requestId,
    redirectUri,
    scope,
    state: query.state,
  });
};

export default authorise;
