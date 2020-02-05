// Hey Emacs, this is -*- coding: utf-8 -*-

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
