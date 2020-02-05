// Hey Emacs, this is -*- coding: utf-8 -*-

const randomStringGenerate = (
  count: number,
): string => [...Array(count)].map(
  () => Math.random().toString(36)[2],
).join('');

export default randomStringGenerate;
