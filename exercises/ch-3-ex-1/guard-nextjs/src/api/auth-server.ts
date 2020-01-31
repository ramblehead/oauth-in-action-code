// Hey Emacs, this is -*- coding: utf-8 -*-

import * as yup from 'yup';

export const authServerConfig: AuthServerConfig = {
  authorizationEndpoint: 'http://localhost:9001/authorize',
  tokenEndpoint: 'http://localhost:9001/token',
};

export const authServerConfigSchema = yup.object().shape({
  authorizationEndpoint: yup.string().required(),
  tokenEndpoint: yup.string().required(),
}).noUnknown();

export type AuthServerConfig = yup.InferType<typeof authServerConfigSchema>;
