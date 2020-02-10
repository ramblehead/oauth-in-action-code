// Hey Emacs, this is -*- coding: utf-8 -*-

import url from 'url';

import { NextApiResponse } from 'next';

import {
  approveInputSchema,
  ApproveInput,
  ApproveOutput,
} from '../../shared/approve';

import withServerSession, {
  RequestWithSession,
} from '../../server/withServerSession';

import { randomStringGenerate } from '../../server/utils';

import {
  getClient,
  scopeAllowed,
} from '../../server/clients';

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

  const input = req.body as ApproveInput;
  const inputValid =
    await approveInputSchema.isValid(input, { strict: true });

  if(!inputValid) {
    const invalidQueryErrorMessage = `Invalid input: ${input}`;
    res.statusMessage = invalidQueryErrorMessage;
    res.status(404).end();
    return;
  }

  const authoriseInput =
    await req.serverSession.getAuthoriseInput(input.authoriseInputId);

  if(!authoriseInput) {
    const noMatchingAuthRequestErrorMessage =
      'No matching authorization request';
    res.statusMessage = noMatchingAuthRequestErrorMessage;
    res.status(500).end();
    return;
  }

  const output: ApproveOutput = {
    responseUrl: '',
  };

  if(input.approval === 'approved') {
    if(authoriseInput.responseType === 'code') {
      const code = randomStringGenerate(8);

      const urlParsed = url.parse(authoriseInput.redirectUrl, true);
      urlParsed.query = urlParsed.query || {};

      const client = getClient(authoriseInput.clientId);

      if(!client) {
        const unknownClientErrorMessage =
          `Unknown clientId: "${authoriseInput.clientId}"`;
        res.statusMessage = unknownClientErrorMessage;
        res.status(500).end();
        return;
      }

      if(scopeAllowed(client, input.selectedScope)) {
        await req.serverSession.setCodeRecord(code, {
          authoriseInput,
          scope: input.selectedScope,
        });

        urlParsed.query.code = code;
        urlParsed.query.state = authoriseInput.state;
        output.responseUrl = url.format(urlParsed);
      }
      else {
        urlParsed.query.error = 'invalid_scope';
        output.responseUrl = url.format(urlParsed);
      }
    }
    else {
      const urlParsed = url.parse(authoriseInput.redirectUrl, true);
      urlParsed.query = urlParsed.query || {};
      urlParsed.query.error = 'unsupported_response_type';
      output.responseUrl = url.format(urlParsed);
    }
  }
  else {
    const urlParsed = url.parse(authoriseInput.redirectUrl, true);
    urlParsed.query = urlParsed.query || {};
    urlParsed.query.error = 'access_denied';
    output.responseUrl = url.format(urlParsed);
  }

  res.status(200).json(output);
};

export default withServerSession(approve);
