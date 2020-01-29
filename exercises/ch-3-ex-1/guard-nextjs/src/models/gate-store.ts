// Hey Emacs, this is -*- coding: utf-8 -*-
import * as dd from 'deep-diff';
import clonedeep from 'lodash.clonedeep';

import { Model } from './use-model';
import Action from './model-action';

export interface ProcessTreeComponent {
  title: string;
  subtitle?: string;
  id: string;
  collection: string;
  // elementId: string;
  // children: element variants and alternatives;
  expanded?: boolean;
}

export interface ProcessTreeProcessInput {
  title: 'Input Components';
  children: ProcessTreeComponent[];
  expanded?: boolean;
}

export interface ProcessTreeProcessOutput {
  title: 'Output Components';
  children: ProcessTreeComponent[];
  expanded?: boolean;
}

// export interface ProcessTreeItem {
//   title: string;
//   id?: string;
//   collection?: string;
//   subtitle?: string;
//   expanded?: boolean;
//   children?: ProcessTreeItem[];
// }

export interface ProcessTreeProcess {
  title: string;
  subtitle?: string;
  id: string;
  collection: string;
  children: [
    ProcessTreeProcessInput,
    ProcessTreeProcessOutput,
  ];
  expanded?: boolean;
}

export type ProcessTreeData = ProcessTreeProcess[];

interface ProcessTreeStore {
  data: ProcessTreeData;
}

type ProcessTreeStoreDelta = dd.Diff<ProcessTreeStore>[] | undefined;

class ProcessTree extends Model {
  constructor() {
    super();

    this._treeStore = {
      data: [{
        collection: 'processes',
        id: '0000',
        title: 'Do something good',
        children: [{
          title: 'Input Components',
          children: [],
        }, {
          title: 'Output Components',
          children: [],
        }],
      }],
    };
  }

  // setTreeData(
  //   value: ProcessTreeData,
  //   update = true,
  // ): void {
  //   this._treeData = value;
  //   if(update) this.update();
  // }/

  setTreeData = new Action(
    this,
    (value: ProcessTreeData): ProcessTreeStoreDelta => {
      const delta = clonedeep(dd.diff(
        this._treeStore,
        { ...this._treeStore, data: value },
      ));
      if(delta) this._treeStore.data = [...value];
      return delta;
    },
    (deltaApply): void => {
      if(deltaApply) deltaApply.forEach((change): void => {
        dd.applyChange(this._treeStore, true, change);
        this._treeStore.data = [...this._treeStore.data];
      });
    },
    (deltaRevert): void => {
      if(deltaRevert) deltaRevert.forEach((change): void => {
        dd.revertChange(this._treeStore, true, change);
        this._treeStore.data = [...this._treeStore.data];
      });
    },
  );

  get treeData(): ProcessTreeData {
    return this._treeStore.data;
  }

  private _treeStore: ProcessTreeStore;
}

export default class GateStore extends Model {
  get processTree(): ProcessTree {
    return this._processTree;
  }

  private _processTree = new ProcessTree();
}
