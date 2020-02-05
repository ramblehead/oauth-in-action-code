// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import * as yup from 'yup';

export const querySchema = yup.object().shape({
  response_type: yup.string().required(),
  client_id: yup.string().required(),
  redirect_uri: yup.string().required(),
  scope: yup.string(),
  state: yup.string().required(),
}).noUnknown();

export type Query = yup.InferType<typeof querySchema>;

export const authoriseInputSchema = yup.object().shape({
  responseType: yup.string().required(),
  clientId: yup.string().required(),
  redirectUrl: yup.string().required(),
  requestedScope: yup.array().of(yup.string().required()),
  state: yup.string().required(),
}).noUnknown();

export type AuthoriseInput = yup.InferType<typeof authoriseInputSchema>;

export const authoriseOutputSchema = yup.object().shape({
  requestId: yup.string().required(),
  authorisedScope: yup.array().of(yup.string().required()),
}).noUnknown();

export type AuthoriseOutput = yup.InferType<typeof authoriseOutputSchema>;
