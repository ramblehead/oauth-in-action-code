// Hey Emacs, this is -*- coding: utf-8 -*-

import { NextApiRequest, NextApiResponse } from 'next';

import {
  approveInputSchema,
  ApproveInput,
} from '../../api/approve';

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

  const approveInput = req.body as ApproveInput;

  const approveInputValid =
    await approveInputSchema.isValid(approveInput, { strict: true });

  console.log('approveInputValid =', approveInputValid);
  console.log(typeof req.body, req.body);
  res.status(200).json(req.body);
  // res.status(200).send(JSON.stringify(req.body));

  // res.status(200).send(req.body);
  // res.status(200).end();

  // res.status(200).end();
};

export default approve;
