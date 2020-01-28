// Hey Emacs, this is -*- coding: utf-8 -*-

import storage from 'node-persist';

const initPromise = storage.init();

const getStorage = async () => {
  await initPromise;
  return storage;
}

export default getStorage;
