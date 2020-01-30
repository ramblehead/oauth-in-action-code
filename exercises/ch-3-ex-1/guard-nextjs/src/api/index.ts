// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable import/prefer-default-export */

import ServerSession from './server-session';

export const randomStringGenerate = (
  count: number,
): string => [...Array(count)].map(
  () => Math.random().toString(36)[2],
).join('');

export const serverSession = new ServerSession();
