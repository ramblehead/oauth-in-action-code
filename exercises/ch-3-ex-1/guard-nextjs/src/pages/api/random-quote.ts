// Hey Emacs, this is -*- coding: utf-8 -*-

import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  quote: string;
  author: string;
}

export default (
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
): void => {
  res.status(200).json({
    quote: 'Write tests, not too many, mostly integration',
    author: 'Guillermo Rauch',
  });
};
