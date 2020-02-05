// Hey Emacs, this is -*- coding: utf-8 -*-

import * as yup from 'yup';

import MapSchema from './MapSchema';

export const approveInputSchema = yup.object().shape({
  responseType: yup.string().required(),
  requestId: yup.string().required(),
  // map hack until it is supported:
  // https://github.com/jquense/yup/issues/524
  // scopeSelection: yup.object(),
  scopeSelection: MapSchema(
    yup.string().min(3),
    yup.boolean().required(),
  ),
  state: yup.string().required(),
  approval: yup.string().oneOf(['approved', 'denied']).required(),
}).noUnknown();

type ApproveInputInferred = yup.InferType<typeof approveInputSchema>;

// interface ScopeSelection {
//   [ scope: string ]: boolean;
// }

type Approval = 'approved' | 'denied';

export interface ApproveInput extends ApproveInputInferred {
  // scopeSelection: ScopeSelection;
  approval: Approval;
}

export const approveOutputSchema = yup.object().shape({
  responseUrl: yup.string().required(),
}).noUnknown();

export type ApproveOutput = yup.InferType<typeof approveOutputSchema>;
