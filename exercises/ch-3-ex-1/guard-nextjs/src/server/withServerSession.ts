// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable class-methods-use-this */

import storage, {
  WriteFileResult,
  DeleteFileResult,
} from 'node-persist';

import { NextApiRequest, NextApiResponse } from 'next';

import { AuthoriseInput } from '../shared/authorise';
import { CodeRecord } from './code';

let storageInitialised = false;

const storageInitialiseLazy = async (): Promise<void> => {
  if(!storageInitialised) {
    await storage.init({
      expiredInterval: 2 * 60 * 1000,
      ttl: 5 * 60 * 1000,
    });
    storageInitialised = true;
  }
};

class ServerSession {
  async setAuthoriseInput(
    id: string,
    request: AuthoriseInput,
  ): Promise<WriteFileResult> {
    return storage.setItem(`request/${id}`, request);
  }

  async getAuthoriseInput(id: string): Promise<AuthoriseInput | null> {
    return storage.getItem(`request/${id}`);
  }

  async setCodeRecord(
    code: string,
    record: CodeRecord,
  ): Promise<WriteFileResult> {
    return storage.setItem(`codeRecord/${code}`, record);
  }

  async getCodeRecord(code: string): Promise<CodeRecord | null> {
    return storage.getItem(`codeRecord/${code}`);
  }

  async deleteCodeRecord(code: string): Promise<DeleteFileResult> {
    return storage.removeItem(`codeRecord/${code}`);
  }
}

const serverSession = new ServerSession();

export interface RequestWithSession extends NextApiRequest {
  serverSession: ServerSession;
}

type HigherOrderHandler =
  (req: RequestWithSession, res: NextApiResponse) => Promise<void>;

type Handler =
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

const withServerSession = (handler: HigherOrderHandler): Handler => (
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    await storageInitialiseLazy();
    const hreq = req as RequestWithSession;
    hreq.serverSession = serverSession;
    return handler(hreq, res);
  }
);

export default withServerSession;
