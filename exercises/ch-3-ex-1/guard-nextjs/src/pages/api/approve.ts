// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';

const approve = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  console.log('**** here');

  if(req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    const methodNotAllowedErrorMessage = `Method ${req.method} Not Allowed`;
    res.statusCode = 405;
    res.statusMessage = methodNotAllowedErrorMessage;
    res.end();
    return;
  }

  // console.log(JSON.parse(req.body));
  console.log(typeof req.body, req.body);
  res.status(200).json(req.body);
  // res.status(200).send(JSON.stringify(req.body));

  // res.status(200).send(req.body);
  // res.status(200).end();

  // res.status(200).end();
};

export default approve;
