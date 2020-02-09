// Hey Emacs, this is -*- coding: utf-8 -*-

import * as yup from 'yup';

export const approveInputSchema = yup.object().shape({
  responseType: yup.string().required(),
  authoriseInputId: yup.string().required(),
  selectedScope: yup.array().of(yup.string().required()),
  state: yup.string().required(),
  approval: yup.string().oneOf(['approved', 'denied']).required(),
}).noUnknown();

type ApproveInputInferred = yup.InferType<typeof approveInputSchema>;

type Approval = 'approved' | 'denied';

export interface ApproveInput extends ApproveInputInferred {
  approval: Approval;
}

export const approveOutputSchema = yup.object().shape({
  responseUrl: yup.string().required(),
}).noUnknown();

export type ApproveOutput = yup.InferType<typeof approveOutputSchema>;
