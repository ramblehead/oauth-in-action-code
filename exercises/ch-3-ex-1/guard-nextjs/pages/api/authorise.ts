// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';

import { getClient } from '../../api-data';

import * as yup from 'yup';

export const querySchema = yup.object().shape({
  response_type: yup.string().required(),
  client_id: yup.string().required(),
  redirect_uri: yup.string().required(),
  state: yup.string().required(),
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
    res.status(404).end();
    return;
  }

  const client = getClient(query.client_id);

  if(!client) {
    const unknownClientErrorMessage = `Unknown client "${query.client_id}"`;
    console.log(unknownClientErrorMessage);
    res.render('error', {error: 'Unknown client'});
    return;
  }


  res.status(200).json({
    quote: 'Write tests, not too many, mostly integration',
    author: 'Guillermo Rauch',
  });
};
