// Hey Emacs, this is -*- coding: utf-8 -*-

import * as yup from 'yup';

export const approveInputSchema = yup.object().shape({
  responseType: yup.string().required(),
  requestId: yup.string().required(),
  // map hack until it is property supported:
  // https://github.com/jquense/yup/issues/524
  scopeSelection: yup.object(),
  state: yup.string().required(),
  approval: yup.string().oneOf(['approved', 'denied']),
}).noUnknown();


export type ApproveInput = yup.InferType<typeof approveInputSchema>;
