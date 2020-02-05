// Hey Emacs, this is -*- coding: utf-8 -*-

import { createContext } from 'react';

type UpdateFunction = () => void;

interface Request {
  authorizationEndpointRequest: any;
  scope: string[];
  user: string;
}

interface Client {
  id: string;
  secret: string;
  redirectUris: string[];
  scope: string;
}

export class AppSession {
  count = 0;

  // client information
  readonly clients: Client[] = [
    {
      id: 'oauth-client-1',
      secret: 'oauth-client-secret-1',
      redirectUris: ['http://localhost:9000/callback'],
      scope: 'foo bar',
    },
  ];

  codes: { [code: string]: Request } = {};

  requests = {};

  getClient(clientId: string): Client | undefined {
    return this.clients.find((client) => client.id === clientId);
  }

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
