// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import * as yup from 'yup';

export const querySchema = yup.object().shape({
  // response_type: yup.string().required(),
  client_id: yup.string().required(),
  redirect_uri: yup.string().required(),
  scope: yup.string(),
  // state: yup.string().required(),
}).noUnknown();

export type Query = yup.InferType<typeof querySchema>;

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
  scope: string[];
}

const clients: Client[] = [
  {
    id: 'oauth-client-1',
    secret: 'oauth-client-secret-1',
    redirectUris: ['http://localhost:9000/callback'],
    scope: ['foo', 'bar'],
  },
];

export const getClient = (
  clientId: string,
): Client | undefined => (
  clients.find((client) => client.id === clientId)
);

export const isValidRedirectUri = (
  client: Client, uri: string,
): string | undefined => (
  client.redirectUris.find((redirectUri) => redirectUri === uri)
);

export const isValidScope = (
  client: Client, scope: string[] | undefined,
): boolean => (
  scope ? scope.every((item) => client.scope.includes(item)) : true
);
