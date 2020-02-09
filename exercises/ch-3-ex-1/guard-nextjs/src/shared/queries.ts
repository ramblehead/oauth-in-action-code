// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import * as yup from 'yup';

export const authorisationEndpointRequestSchema = yup.object().shape({
  response_type: yup.string().required(),
  client_id: yup.string().required(),
  redirect_uri: yup.string().required(),
  scope: yup.string(),
  state: yup.string().required(),
}).noUnknown();

export type AuthorisationEndpointRequest =
  yup.InferType<typeof authorisationEndpointRequestSchema>;
