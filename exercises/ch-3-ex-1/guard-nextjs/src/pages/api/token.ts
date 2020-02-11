// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiResponse } from 'next';

import withServerSession, {
  RequestWithSession,
} from '../../server/withServerSession';

import {
  ClientCredentials,
  decodeClientCredentials,
  randomStringGenerate,
} from '../../server/utils';

import { getClient } from '../../server/clients';

const nosql = require('nosql').load(
  '/home/rh/projects/oauth-in-action-code/exercises/ch-3-ex-1/database.nosql',
);

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

  let credentials: ClientCredentials | undefined;

  // Check the auth header
  const auth = req.headers.authorization;
  if(auth) {
    const credentialsEncoded = auth.slice('Basic '.length);
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
    // console.log('Mismatched client secret');
    const mismatchedClientSecretErrorMessage = 'Mismatched client secret';
    res.statusCode = 401;
    res.statusMessage = mismatchedClientSecretErrorMessage;
    res.json({ error: 'invalid_client' });
    return;
  }

  if(req.body.grant_type === 'authorization_code') {
    const codeRecord = await req.serverSession.getCodeRecord(req.body.code);
    if(codeRecord) {
      req.serverSession.deleteCodeRecord(req.body.code);

      if(codeRecord.authoriseInput.clientId === clientId) {
        const accessToken = randomStringGenerate(8);

        let scope: string | null = null;
        if(codeRecord.scope) scope = codeRecord.scope.join(' ');

        nosql.insert({
          access_token: accessToken,
          client_id: clientId,
          scope,
        });

        res.status(200).json({
          access_token: accessToken,
          token_type: 'Bearer',
          scope,
        });

        console.log('Issuing access token %s', accessToken);
        console.log('with scope %s', scope);
        console.log('Issued tokens for code %s', req.body.code);
      }
      else {
        const clientMismatchErrorMessage = 'Client mismatch';
        res.statusCode = 400;
        res.statusMessage = clientMismatchErrorMessage;
        res.json({ error: 'invalid_grant' });
      }
    }
    else {
      const unknownGrantType = `Unknown code, "${req.body.code}"`;
      res.statusCode = 400;
      res.statusMessage = unknownGrantType;
      res.json({ error: 'invalid_grant' });
    }
  }
  else {
    const unknownGrantType = `Unknown grant type: "${req.body.grant_type}"`;
    res.statusCode = 400;
    res.statusMessage = unknownGrantType;
    res.json({ error: 'unsupported_grant_type' });
  }
};

export default withServerSession(approve);
