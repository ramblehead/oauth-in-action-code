// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';

import {
  serverSession,
  randomStringGenerate,
} from '../../api';

import {
  Query,
  InternalResponse,
  getClient,
  isValidRedirectUri,
  isValidScope,
  querySchema,
} from '../../api/authorise';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<InternalResponse>,
): Promise<void> => {
  if(req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    const methodNotAllowedErrorMessage = `Method ${req.method} Not Allowed`;
    res.statusCode = 405;
    res.statusMessage = methodNotAllowedErrorMessage;
    res.end();
  }

  const query = req.query as Query;
  const queryValid = querySchema.isValidSync(query, { strict: true });
  if(!queryValid) {
    const invalidQueryErrorMessage = `Invalid query: ${req.url}`;
    res.statusCode = 404;
    res.statusMessage = invalidQueryErrorMessage;
    res.end();
    return;
  }

  const client = getClient(query.client_id);

  if(!client) {
    const unknownClientErrorMessage = `Unknown client_id: "${query.client_id}"`;
    res.statusCode = 404;
    res.statusMessage = unknownClientErrorMessage;
    res.end();
    return;
  }

  const redirectUri = query.redirect_uri;

  if(!isValidRedirectUri(client, redirectUri)) {
    const invalidRedirectUriErrorMessage =
      `Invalid Redirect URI: "${redirectUri}"`;
    res.statusCode = 404;
    res.statusMessage = invalidRedirectUriErrorMessage;
    res.end();
    return;
  }

  const requestedScope = query.scope ? query.scope.split(' ') : undefined;
  if(!isValidScope(client, requestedScope)) {
    const invalidRequestedScopeErrorMessage =
      `Invalid Requested Scope: "${query.scope}"`;
    res.statusCode = 404;
    res.statusMessage = invalidRequestedScopeErrorMessage;
    res.end();
    return;
  }

  const requestId = randomStringGenerate(8);
  serverSession.requests.set(requestId, query);

  res.status(200).json({ request_id: requestId });
};
