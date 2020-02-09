// Hey Emacs, this is -*- coding: utf-8 -*-

import * as yup from 'yup';

export const authoriseInputSchema = yup.object().shape({
  responseType: yup.string().required(),
  clientId: yup.string().required(),
  redirectUrl: yup.string().required(),
  requestedScope: yup.array().of(yup.string().required()),
  state: yup.string().required(),
}).noUnknown();

export type AuthoriseInput = yup.InferType<typeof authoriseInputSchema>;

export const authoriseOutputSchema = yup.object().shape({
  authoriseInputId: yup.string().required(),
  authorisedScope: yup.array().of(yup.string().required()),
}).noUnknown();

export type AuthoriseOutput = yup.InferType<typeof authoriseOutputSchema>;
