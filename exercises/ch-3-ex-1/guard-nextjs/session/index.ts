// Hey Emacs, this is -*- coding: utf-8 -*-

import { createContext } from 'react';

type UpdateFunction = () => void;

interface Request {
  authorizationEndpointRequest: any;
  scope: string[];
  user: string;
}

export class AppSession {
  count = 0;

  // authorization server information
  readonly authServer = {
    authorizationEndpoint: 'http://localhost:9001/authorize',
    tokenEndpoint: 'http://localhost:9001/token',
  };

  // client information
  readonly clients = [
    {
      clientId: 'oauth-client-1',
      clientSecret: 'oauth-client-secret-1',
      redirectUris: ['http://localhost:9000/callback'],
      scope: 'foo bar',
    },
  ];

  codes: { [code: string]: Request } = {};

  requests = {};

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
