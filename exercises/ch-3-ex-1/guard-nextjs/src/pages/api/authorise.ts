// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';

import serverSession from '../../server/session';

import randomStringGenerate from '../../server/randomStringGenerate';

import {
  AuthoriseInput,
  AuthoriseOutput,
  authoriseInputSchema,
} from '../../shared/authorise';

import {
  getClient,
  redirectUriValid,
  scopeAllowed,
} from '../../server/clients';

const authorise = async (
  req: NextApiRequest,
  res: NextApiResponse<AuthoriseOutput>,
): Promise<void> => {
  if(req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    const methodNotAllowedErrorMessage = `Method ${req.method} Not Allowed`;
    res.statusMessage = methodNotAllowedErrorMessage;
    res.status(405).end();
    return;
  }

  const input = req.body as AuthoriseInput;
  const inputValid =
    await authoriseInputSchema.isValid(input, { strict: true });

  if(!inputValid) {
    const invalidInputErrorMessage = `Invalid input: ${input}`;
    res.statusMessage = invalidInputErrorMessage;
    res.status(404).end();
    return;
  }

  const client = getClient(input.clientId);

  if(!client) {
    const unknownClientErrorMessage = `Unknown clientId: "${input.clientId}"`;
    res.statusMessage = unknownClientErrorMessage;
    res.status(404).end();
    return;
  }

  if(!redirectUriValid(client, input.redirectUrl)) {
    const invalidRedirectUriErrorMessage =
      `Invalid Redirect redirectUrl: "${input.redirectUrl}"`;
    res.statusMessage = invalidRedirectUriErrorMessage;
    res.status(404).end();
    return;
  }

  if(!scopeAllowed(client, input.requestedScope)) {
    const invalidRequestedScopeErrorMessage =
      `Invalid Requested Scope: "${input.requestedScope}"`;
    res.statusMessage = invalidRequestedScopeErrorMessage;
    res.status(404).end();
    return;
  }

  const authorisedScope = input.requestedScope;

  const requestId = randomStringGenerate(8);
  serverSession.requests.set(requestId, input);

  res.status(200).json({
    requestId,
    authorisedScope,
  });
};

export default authorise;
