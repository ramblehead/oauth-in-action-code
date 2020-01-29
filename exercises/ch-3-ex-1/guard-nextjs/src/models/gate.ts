// Hey Emacs, this is -*- coding: utf-8 -*-

import { Model, createModelRefContextProvider } from './use-model';
import GateStore from './gate-store';
import LandApi, { configLandUri } from './land-api';

export default class Gate extends Model {
  constructor() {
    super();

    console.log('!!!! here');
  }

  get store(): GateStore {
    return this._store;
  }

  get landApi(): LandApi {
    return this._landApi;
  }

  private _store: GateStore = new GateStore();
  private _landApi = new LandApi(this._store, configLandUri);
}

const [
  GateRefContextProvider,
  useGateRefContext,
] = createModelRefContextProvider(Gate);

export {
  GateRefContextProvider,
  useGateRefContext,
};
