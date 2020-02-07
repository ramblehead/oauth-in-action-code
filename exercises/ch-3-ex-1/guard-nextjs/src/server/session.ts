// Hey Emacs, this is -*- coding: utf-8 -*-

import fs, { promises as fsp } from 'fs';

import { AuthoriseInput } from '../shared/authorise';

type Expiry = Date | null;

interface RequestRecord {
  request: AuthoriseInput;
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

  set(id: string, request: AuthoriseInput): void {
    this._records[id] = { request, expiry: null };
    this.save();
  }

  get(id: string): AuthoriseInput | undefined {
    const record = this._records[id];
    if(record) return record.request;
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

  private _records: RequestRecords = {};
  private _saveScheduled = false;
}

class ServerSession {
  requests = new Requests('requests-store.json');
}

const serverSession = new ServerSession();

export default serverSession;


// //you must first call storage.init
// await storage.init( /* options ... */ );
// await storage.setItem('name','yourname')
// console.log(await storage.getItem('name')); // yourname
