// Hey Emacs, this is -*- coding: utf-8 -*-

import querystring from 'querystring';

export const randomStringGenerate = (
  count: number,
): string => [...Array(count)].map(
  () => Math.random().toString(36)[2],
).join('');

export const encodeClientCredentials = (
  clientId: string,
  clientSecret: string,
): string => {
  const clientIdEsc = querystring.escape(clientId);
  const clientSecretEsc = querystring.escape(clientSecret);
  return Buffer.from(`${clientIdEsc}:${clientSecretEsc}`).toString('base64');
};

export type DecodeClientCredentialsResult = {
  clientId: string;
  clientSecret: string;
};

export const decodeClientCredentials = (
  credentialsEncoded: string,
): DecodeClientCredentialsResult => {
  const credentials = Buffer.from(credentialsEncoded, 'base64').toString();
  const [clientIdEsc, clientSecretEsc] = credentials.split(':');
  const clientId = querystring.unescape(clientIdEsc);
  const clientSecret = querystring.unescape(clientSecretEsc);
  return { clientId, clientSecret };
};
