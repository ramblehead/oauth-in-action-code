// Hey Emacs, this is -*- coding: utf-8 -*-

import { NextApiResponse } from 'next';

import withServerSession, {
  RequestWithSession,
} from '../../server/withServerSession';

import { encodeClientCredentials } from '../../server/utils';

// import randomStringGenerate from '../../server/randomStringGenerate';

// import { getClient } from '../../server/clients';

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
    // return;
  }

  // const auth = req.headers.authorization;
  // if(auth) {
  //   // check the auth header
  //   var clientCredentials =
  //     Buffer.from(auth.slice('basic '.length), 'base64')
  //     .toString().split(':');
  //   var clientId = querystring.unescape(clientCredentials[0]);
  //   var clientSecret = querystring.unescape(clientCredentials[1]);
  // }
};

export default withServerSession(approve);
