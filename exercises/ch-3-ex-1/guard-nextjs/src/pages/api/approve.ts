// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';

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

  res.status(200).send(JSON.stringify(req.body));

  // res.status(200).send(req.body);
  // res.status(200).end();

  // res.status(200).end();
};

export default approve;
