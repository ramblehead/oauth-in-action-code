// Hey Emacs, this is -*- coding: utf-8 -*-

import {
  Dispatch,
  SetStateAction,
} from 'react';

interface States {
  count: [number, Dispatch<SetStateAction<number>>];
}

export default class AppSession {
  constructor(
    private states: States,
  ) {}

  static get countInit(): number {
    return 0;
  }

  get count(): number {
    return this.states.count[0];
  }

  set count(value: number) {
    const setCount = this.states.count[1];
    setCount(value);
  }
}
