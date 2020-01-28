// Hey Emacs, this is -*- coding: utf-8 -*-

import fs from 'fs';
// import path from 'path';
// import * as yup from 'yup';

export class ServerSession {
  // readonly fileName = path.join(__dirname, 'session.json');
  readonly fileName = 'session-store.json';

  constructor() {
    if(fs.existsSync(this.fileName)) this.loadSync();
    else this.saveSync();
  }

  saveSync(): void {
    const storeJson = JSON.stringify(this._store);
    fs.writeFileSync(this.fileName, storeJson);
  }

  loadSync(): void {
    const storeJson = fs.readFileSync(this.fileName, 'utf8');
    this._store = JSON.parse(storeJson);
  }

  set count(value: number) {
    this._store.count = value;
    this.saveSync();
  }

  get count(): number {
    return this._store.count;
  }

  private _store = {
    count: 0,
  };
}

export const serverSession = new ServerSession();
