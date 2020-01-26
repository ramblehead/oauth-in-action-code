// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';

import * as yup from 'yup';

import { getClient } from '../../api-data';

export const querySchema = yup.object().shape({
  // response_type: yup.string().required(),
  client_id: yup.string().required(),
  // redirect_uri: yup.string().required(),
  // state: yup.string().required(),
}).noUnknown();

export type Query = yup.InferType<typeof querySchema>;

type ResponseData = {
  quote: string;
  author: string;
}

export default (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
): void => {
  const query = req.query as Query;
  const queryIsValid = querySchema.isValidSync(query, { strict: true });
  if(!queryIsValid) {
    const invalidQueryErrorMessage = `Invalid query: ${req.url}`;
    res.statusCode = 404;
    res.statusMessage = invalidQueryErrorMessage;
    res.end();
    return;
  }

  const client = getClient(query.client_id);

  if(!client) {
    const unknownClientErrorMessage = `Unknown client: "${query.client_id}"`;
    res.statusCode = 404;
    res.statusMessage = unknownClientErrorMessage;
    res.end();
    return;
  }

  res.status(200).json({
    quote: 'Write tests, not too many, mostly integration',
    author: 'Guillermo Rauch',
  });
};
