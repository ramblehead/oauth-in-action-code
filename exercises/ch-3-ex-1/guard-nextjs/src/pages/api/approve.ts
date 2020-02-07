// Hey Emacs, this is -*- coding: utf-8 -*-

import url from 'url';

import { NextApiRequest, NextApiResponse } from 'next';

import {
  approveInputSchema,
  ApproveInput,
  ApproveOutput,
} from '../../shared/approve';

import serverSession from '../../server/session';

import randomStringGenerate from '../../server/randomStringGenerate';

import {
  getClient,
  scopeAllowed,
} from '../../server/clients';

const approve = async (
  req: NextApiRequest,
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

  const request = serverSession.requests.get(input.requestId);

  if(!request) {
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
    if(request.responseType === 'code') {
      const code = randomStringGenerate(8);

      const urlParsed = url.parse(request.redirectUrl, true);
      urlParsed.query = urlParsed.query || {};

      const client = getClient(request.clientId)!;
      if(scopeAllowed(client, input.selectedScope)) {
        // save code here
        urlParsed.query.code = code;
        urlParsed.query.state = request.state;
        output.responseUrl = url.format(urlParsed);
      }
      else {
        urlParsed.query.error = 'invalid_scope';
        output.responseUrl = url.format(urlParsed);
      }
    }
    else {
      const urlParsed = url.parse(request.redirectUrl, true);
      urlParsed.query = urlParsed.query || {};
      urlParsed.query.error = 'unsupported_response_type';
      output.responseUrl = url.format(urlParsed);
    }
  }
  else {
    const urlParsed = url.parse(request.redirectUrl, true);
    urlParsed.query = urlParsed.query || {};
    urlParsed.query.error = 'access_denied';
    output.responseUrl = url.format(urlParsed);
  }

  res.status(200).json(output);
};

export default approve;
