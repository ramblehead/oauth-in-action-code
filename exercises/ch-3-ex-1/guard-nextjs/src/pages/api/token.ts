// Hey Emacs, this is -*- coding: utf-8 -*-

import { NextApiResponse } from 'next';

import withServerSession, {
  RequestWithSession,
} from '../../server/withServerSession';

import {
  decodeClientCredentials,
  DecodeClientCredentialsResult,
} from '../../server/utils';

import { getClient } from '../../server/clients';

// import randomStringGenerate from '../../server/randomStringGenerate';

const approve = async (
  req: RequestWithSession,
  res: NextApiResponse,
): Promise<void> => {
  if(req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    const methodNotAllowedErrorMessage = `Method ${req.method} Not Allowed`;
    res.statusCode = 405;
    res.statusMessage = methodNotAllowedErrorMessage;
    res.end();
    return;
  }

  let credentials: DecodeClientCredentialsResult | undefined;

  // Check the auth header
  const auth = req.headers.authorization;
  if(auth) {
    const credentialsEncoded = auth.slice('basic '.length);
    credentials = decodeClientCredentials(credentialsEncoded);
  }

  // Otherwise, check the post body
  if(req.body.client_id) {
    if(credentials) {
      const multipleAuthMethodsAttemptErrorMessage =
        'Client attempted to authenticate with multiple methods';
      res.statusCode = 401;
      res.statusMessage = multipleAuthMethodsAttemptErrorMessage;
      res.json({ error: 'invalid_client' });
      return;
    }

    credentials = {
      clientId: req.body.client_id,
      clientSecret: req.body.client_secret,
    };
  }

  if(!credentials) {
    const incorrectTokenRequestErrorMessage = 'Incorrect token request';
    res.statusCode = 401;
    res.statusMessage = incorrectTokenRequestErrorMessage;
    res.json({ error: 'invalid_client' });
    return;
  }

  const { clientId, clientSecret } = credentials;

  const client = getClient(clientId);

  if(!client) {
    const unknownClientErrorMessage = `Unknown clientId: "${clientId}"`;
    res.statusCode = 401;
    res.statusMessage = unknownClientErrorMessage;
    res.json({ error: 'invalid_client' });
    return;
  }

  if(client.secret !== clientSecret) {
    console.log('Mismatched client secret');
    const mismatchedClientSecretErrorMessage = 'Mismatched client secret';
    res.statusCode = 401;
    res.statusMessage = mismatchedClientSecretErrorMessage;
    res.json({ error: 'invalid_client' });
    return;
  }

  if(req.body.grant_type === 'authorization_code') {
    const codeRecord = await req.serverSession.getCodeRecord(req.body.code);
    if(codeRecord) {
    }
    else {
      const unknownGrantType =
        `Unknown code, "${req.body.code}"`;
      res.statusCode = 400;
      res.statusMessage = unknownGrantType;
      res.json({ error: 'invalid_grant' });
    }
  }
  else {
    const unknownGrantType =
      `Unknown grant type: "${req.body.grant_type}"`;
    res.statusCode = 400;
    res.statusMessage = unknownGrantType;
    res.json({ error: 'unsupported_grant_type' });
  }
};

export default withServerSession(approve);
