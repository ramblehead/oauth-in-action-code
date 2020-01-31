// Hey Emacs, this is -*- coding: utf-8 -*-

import fs, { promises as fsp } from 'fs';

import { Query } from './authorise';

type Expiry = Date | null;

interface RequestRecord {
  query: Query;
  expiry: Expiry;
}

interface RequestRecords {
  [ id: string ]: RequestRecord;
}

class Requests {
  constructor(
    private fileName: string,
  ) {
    if(fs.existsSync(this.fileName)) this.loadSync();
    else this.saveSync();
  }

  private saveSync(): void {
    const storeJson = JSON.stringify(this._records);
    fs.writeFileSync(this.fileName, storeJson);
  }

  private loadSync(): void {
    const storeJson = fs.readFileSync(this.fileName, 'utf8');
    this._records = JSON.parse(storeJson);
  }

  private async doSave(): Promise<void> {
    const storeJson = JSON.stringify(this._records, undefined, 2);
    return fsp.writeFile(this.fileName, storeJson);
  }

  set(id: string, query: Query): void {
    this._records[id] = { query, expiry: null };
    this.save();
  }

  get(id: string): Query | undefined {
    const record = this._records[id];
    if(record) return record.query;
    return undefined;
  }

  save(): void {
    if(this._saveScheduled) return;
    this._saveScheduled = true;
    setTimeout(async () => {
      this._saveScheduled = false;
      await this.doSave();
    }, 0);
  }

  private _records = {} as RequestRecords;
  private _saveScheduled = false;
}

class ServerSession {
  requests = new Requests('requests-store.json');
}

export default ServerSession;
