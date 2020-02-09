// Hey Emacs, this is -*- coding: utf-8 -*-

import { NextApiResponse } from 'next';

import withServerSession, {
  RequestWithSession,
} from '../../server/withServerSession';

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
    return;
  }

};

export default withServerSession(approve);
