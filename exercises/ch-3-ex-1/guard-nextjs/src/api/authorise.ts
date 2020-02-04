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

export const authoriseOutputSchema = yup.object().shape({
  responseType: yup.string().required(),
  requestId: yup.string().required(),
  redirectUrl: yup.string().required(),
  scope: yup.array().of(yup.string().required()),
  state: yup.string().required(),
}).noUnknown();

export type AuthoriseOutput = yup.InferType<typeof authoriseOutputSchema>;

const clients: Client[] = [
  {
    id: 'oauth-client-1',
    secret: 'oauth-client-secret-1',
    redirectUris: ['http://localhost:9000/callback'],
    scope: ['foo', 'bar'],
  },
];

export interface Client {
  id: string;
  secret: string;
  redirectUris: string[];
  scope: string[];
}

export const getClient = (
  clientId: string,
): Client | undefined => (
  clients.find((client) => client.id === clientId)
);

export const redirectUriValid = (
  client: Client, uri: string,
): string | undefined => (
  client.redirectUris.find((redirectUri) => redirectUri === uri)
);

export const scopeAllowed = (
  client: Client, scope: string[] | undefined,
): boolean => (
  scope ? scope.every((item) => client.scope.includes(item)) : true
);
