// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint @typescript-eslint/no-explicit-any: off */

import { Api, Update, Done } from './use-model';

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type ArgsType<T> = T extends (...args: infer A) => any ? A : never;

class ActionAttemptBeforeDone extends Error {
  constructor() {
    super('Attempt to perform Action before previous run is done.');
  }
}

export default class Action<
  Run extends (...args: any[]) => any,
  Apply extends (delta: ReturnType<Run>) => void,
  Revert extends (delta: ReturnType<Run>) => void,
> {
  constructor(
    api: Api,
    run: Run,
    apply: Apply,
    revert: Revert,
  ) {
    this._api = api;
    this._run = run;
    this._apply = apply;
    this._revert = revert;
    this._delta = null;
  }

  run(...args: ArgsType<Run>): Done {
    if(!this.isDone()) throw new ActionAttemptBeforeDone();
    this._delta = this._run(...args);
    this.update();
    return this;
  }

  do(...args: ArgsType<Run>): Update<Done> & Done {
    if(!this.isDone()) throw new ActionAttemptBeforeDone();
    this._delta = this._run(...args);
    return this;
  }

  update(): Done {
    this._api.update();
    return this;
  }

  isDone(): boolean {
    return this._delta == null;
  }

  done(): void {
    this._delta = null;
  }

  cancel(): void {
    if(this._delta) {
      this._revert(this._delta);
      this._delta = null;
      this.update();
    }
  }

  apply(delta: ReturnType<Run>): Update<Done> {
    if(!this.isDone()) throw new ActionAttemptBeforeDone();
    this._apply(delta);
    return this;
  }

  revert(delta: ReturnType<Run>): Update<Done> {
    if(!this.isDone()) throw new ActionAttemptBeforeDone();
    this._revert(delta);
    return this;
  }

  private _api: Api;
  private _run: Run;
  private _apply: Apply;
  private _revert: Revert;
  private _delta: ReturnType<Run> | null;
}
