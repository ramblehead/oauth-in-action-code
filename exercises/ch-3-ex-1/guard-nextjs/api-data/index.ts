// Hey Emacs, this is -*- coding: utf-8 -*-

import * as yup from 'yup';

export const authServerSchema = yup.object().shape({
  authorizationEndpoint: yup.string().required(),
  tokenEndpoint: yup.string().required(),
}).noUnknown();

export type AuthServer = yup.InferType<typeof authServerSchema>;

export const authServer: AuthServer = {
  authorizationEndpoint: 'http://localhost:9001/authorize',
  tokenEndpoint: 'http://localhost:9001/token',
};

export interface Client {
  id: string;
  secret: string;
  redirectUris: string[];
  scope: string;
}

export const clients: Client[] = [
  {
    id: 'oauth-client-1',
    secret: 'oauth-client-secret-1',
    redirectUris: ['http://localhost:9000/callback'],
    scope: 'foo bar',
  },
];
