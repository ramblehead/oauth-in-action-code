// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';

import * as yup from 'yup';

export const querySchema = yup.object().shape({
  client_id: yup.string().required(),
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

  if(!queryIsValid) res.status(404);
  else res.status(200).json({
    quote: 'Write tests, not too many, mostly integration',
    author: 'Guillermo Rauch',
  });
};
