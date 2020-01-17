// Hey Emacs, this is -*- coding: utf-8 -*-

import React, {
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';

export interface Done {
  done(): void;
}

export interface Update<R = void> {
  update(): R;
}

export abstract class Api {
  change(): void {
    this._changed += 1;
  }

  get changed(): number {
    return this._changed;
  }

  abstract update(): void

  private _changed = 0;
}

export type ModelUpdateFunction = () => void;

class UpdateUnallocatedError extends Error {
  constructor() {
    super('ProcessTree.setUpdateCallback() must be called ' +
          'before running any modifying methods.');
  }
}

export class Model extends Api {
  update(): void {
    this._update();
  }

  setUpdateFunction(value: ModelUpdateFunction): void {
    this._update = value;
    const properties = Object.values(this);
    properties.forEach((property): void => {
      if(property instanceof Model) property.setUpdateFunction(value);
    });
  }

  private _update: ModelUpdateFunction = (): void => {
    throw new UpdateUnallocatedError();
  };
}

export interface Ref<M extends Model> {
  current: M;
}

interface ModelClass<M extends Model> {
  new(): M;
}

export function useModelRef<M extends Model>(
  ModelClass: ModelClass<M>,
): Ref<M> {
  const [modelRef, setModelRef] = useState(
    (): Ref<M> => ({ current: new ModelClass() }),
  );

  const update: () => void = useCallback(
    (): void => setModelRef(
      (prevRef: Ref<M>): Ref<M> => ({ current: prevRef.current }),
    ),
    [setModelRef],
  );

  useState((): void => modelRef.current.setUpdateFunction(update));

  return modelRef;
}

export interface ModelRefContextProviderProps {
  children?: React.ReactNode;
}

type CreateModelRefContextProviderResult<M extends Model> = [
  (props: ModelRefContextProviderProps) => JSX.Element,
  () => Ref<M>,
  React.Context<Ref<M>>,
];

export function createModelRefContextProvider<M extends Model>(
  ModelClass: ModelClass<M>,
): CreateModelRefContextProviderResult<M> {
  const ModelRefContext =
    createContext<Ref<M>>(null as unknown as Ref<M>);

  const ModelRefContextProvider =
    (props: ModelRefContextProviderProps): JSX.Element => {
      const modelRef = useModelRef(ModelClass);
      return (
        <ModelRefContext.Provider value={modelRef}>
          {props.children}
        </ModelRefContext.Provider>
      );
    };

  const useModelRefContext = (): Ref<M> => useContext(ModelRefContext);

  return [
    ModelRefContextProvider,
    useModelRefContext,
    ModelRefContext,
  ];
}
