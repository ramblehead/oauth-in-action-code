// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiResponse } from 'next';

import withServerSession, {
  RequestWithSession,
} from '../../server/withServerSession';

import { randomStringGenerate } from '../../server/utils';

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
  req: RequestWithSession,
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

  const id = randomStringGenerate(8);
  req.serverSession.setAuthoriseInput(id, input);

  res.status(200).json({
    authoriseInputId: id,
    authorisedScope,
  });
};

export default withServerSession(authorise);
