// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';
import { authServer, AuthServer } from '../../api/auth-server';

export default (
  req: NextApiRequest,
  res: NextApiResponse<AuthServer>,
): void => {
  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json(authServer);
      break;
    default: {
      res.setHeader('Allow', ['GET']);
      const methodNotAllowedErrorMessage = `Method ${req.method} Not Allowed`;
      res.statusCode = 405;
      res.statusMessage = methodNotAllowedErrorMessage;
      res.end();
    }
  }
};
