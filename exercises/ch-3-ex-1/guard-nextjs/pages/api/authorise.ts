// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';

import { randomStringGenerate } from '../../api-data';

import * as yup from 'yup';

import {
  Query,
  getClient,
  isValidRedirectUri,
  isValidScope,
  querySchema,
} from '../../api-data';

import { serverSession } from '../../api-data/session';

export const responseErrorSchema = yup.object().shape({
  id: yup.string().required(),
  error_message: yup.string().required(),
  count: yup.number(),
}).noUnknown();

export type ResponseError = yup.InferType<typeof responseErrorSchema>;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseError>,
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

  let id = randomStringGenerate(8);
  serverSession.requests[id] = query;

  res.status(200).json({
    id: 'ok',
    error_message: 'No errors',
    count: serverSession.count += 1,
  });

  await serverSession.save();
};
