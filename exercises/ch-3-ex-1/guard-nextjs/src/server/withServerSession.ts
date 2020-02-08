// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable class-methods-use-this */

import storage, { WriteFileResult } from 'node-persist';

import { NextApiRequest, NextApiResponse } from 'next';

import { Query } from '../shared/authorise';

let storageInitialised = false;

const storageInitialiseLazy = async (): Promise<void> => {
  if(!storageInitialised) {
    await storage.init();
    storageInitialised = true;
  }
};

class ServerSession {
  async setQuery(id: string, query: Query): Promise<WriteFileResult> {
    return storage.setItem(id, query);
  }

  async getQuery(id: string, query: Query): Promise<WriteFileResult> {
    return storage.setItem(id, query);
  }
}

const serverSession = new ServerSession();

interface RequestWithSession extends NextApiRequest {
  serverSession: ServerSession;
}

type Handler =
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

type HigherOrderHandler =
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

const withServerSession = (handler: HigherOrderHandler): Handler => (
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    await storageInitialiseLazy();
    const hreq = req as RequestWithSession;
    hreq.serverSession = serverSession;
    handler(hreq, res);
  }
);

export default withServerSession;
