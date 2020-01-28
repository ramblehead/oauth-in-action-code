// Hey Emacs, this is -*- coding: utf-8 -*-

import fs, { promises as fsp } from 'fs';

export class ServerSession {
  // readonly fileName = path.join(__dirname, 'session.json');
  readonly fileName = 'session-store.json';

  constructor() {
    if(fs.existsSync(this.fileName)) this.loadSync();
    else this.saveSync();
  }

  private saveSync(): void {
    const storeJson = JSON.stringify(this._store);
    fs.writeFileSync(this.fileName, storeJson);
  }

  private loadSync(): void {
    const storeJson = fs.readFileSync(this.fileName, 'utf8');
    this._store = JSON.parse(storeJson);
  }

  async save() {
    const storeJson = JSON.stringify(this._store);
    return fsp.writeFile(this.fileName, storeJson);
  }

  set count(value: number) {
    this._store.count = value;
  }

  get count(): number {
    return this._store.count;
  }

  private _store = {
    count: 0,
  };
}

export const serverSession = new ServerSession();
