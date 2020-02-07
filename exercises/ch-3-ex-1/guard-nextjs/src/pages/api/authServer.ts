// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import { NextApiRequest, NextApiResponse } from 'next';
import { authServerConfig, AuthServerConfig } from '../../shared/authServer';

const authServer = (
  req: NextApiRequest,
  res: NextApiResponse<AuthServerConfig>,
): void => {
  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json(authServerConfig);
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

export default authServer;
