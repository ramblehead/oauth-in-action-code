// Hey Emacs, this is -*- coding: utf-8 -*-

import { createContext } from 'react';

type UpdateFunction = () => void;

export class AppSession {
  count = 0;

  update(): void {
    if(this._update) this._update();
  }

  setUpdateFunction(value: UpdateFunction): void {
    this._update = value;
  }

  private _update: UpdateFunction | null = null;
}

export const appSession = new AppSession();

export interface AppSessionRef {
  current: AppSession;
}

export const AppSessionRefContext =
  createContext<AppSessionRef>(null as unknown as AppSessionRef);
