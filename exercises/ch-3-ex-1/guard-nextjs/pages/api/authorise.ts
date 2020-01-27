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

// type ResponseData = {
//   quote: string;
//   author: string;
// }

export interface ResponseId {
  id: 'ok' | 'error';
}

export const responseErrorSchema = yup.object().shape({
  id: yup.string().required(),
  error_message: yup.string().required(),
}).noUnknown();

export type ResponseError = yup.InferType<typeof responseErrorSchema>;

export default (
  req: NextApiRequest,
  res: NextApiResponse<ResponseError>,
): void => {
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
    const unknownClientErrorMessage = `Unknown client: "${query.client_id}"`;
    res.status(200).json({
      id: 'error',
      error_message: unknownClientErrorMessage,
    });
    return;
  }

  res.status(200).json({
    id: 'ok',
    error_message: 'No errors',
  });
};
