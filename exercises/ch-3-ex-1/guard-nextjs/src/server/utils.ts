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

export const decodeClientCredentials = (
  clientId: string,
  clientSecret: string,
): string => {
  const clientIdEsc = querystring.escape(clientId);
  const clientSecretEsc = querystring.escape(clientSecret);
  return Buffer.from(`${clientIdEsc}:${clientSecretEsc}`).toString('base64');
};
