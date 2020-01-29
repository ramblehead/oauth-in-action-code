// Hey Emacs, this is -*- coding: utf-8 -*-

import fetch from 'isomorphic-unfetch';

import { Api, Update } from './use-model';

import GateStore, {
  ProcessTreeProcess,
  ProcessTreeData,
} from './gate-store';

// TODO: landUri should be moved to a global config
export const configLandUri = 'http://localhost:8529/_db/_system/land';

export class LandSource {
  constructor(uri: string) {
    this.uri = uri;
  }

  uri: string;
}

export default class LandApi extends Api {
  constructor(
    gateStore: GateStore,
    source: LandSource | string,
  ) {
    super();

    this._gateModel = gateStore;

    if(typeof source === 'string') this._source = new LandSource(source);
    else this._source = source;
  }

  async loadProcessTree(): Promise<void> {
    const processQueryResult = await fetch(this.source.uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        // https://github.com/apollographql/eslint-plugin-graphql
        // use gql literal stub for now - until there is a need for AST
        query: `
         query GetProcess($id: String!) {
           process(id: $id) {
             collection
             id
             name
             inComponents {
               collection
               id
               name
             }
             outComponents {
               collection
               id
               name
             }
           }
         }
        `,
        variables: {
          id: '0000',
        },
      }),
    }).then((r): any => r.json());

    const { process } = processQueryResult.data;
    const treeData: ProcessTreeData = [];

    treeData.push({
      collection: process.collection,
      id: process.id,
      title: process.name,
      children: [{
        title: 'Input Components',
        children: [],
      }, {
        title: 'Output Components',
        children: [],
      }],
    });

    const inComponents = treeData[0].children[0].children;

    process.inComponents.forEach(
      ({ name, id, collection }: {
        name: string;
        id: string;
        collection: string;
      }): void => {
        inComponents.push({ title: name, id, collection });
      },
    );

    const outComponents = treeData[0].children[1].children;

    process.outComponents.forEach(
      ({ name, id, collection }: {
        name: string;
        id: string;
        collection: string;
      }): void => {
        outComponents.push({ title: name, id, collection });
      },
    );

    this._gateModel.processTree.setTreeData.run(treeData).done();
  }

  setTreeData(value: ProcessTreeProcess[]): Update {
    this._gateModel.processTree.setTreeData.do(value).done();
    return this;
  }

  setSource(value: LandSource): Update {
    this._source = value;
    this.change();
    return this;
  }

  setSourceUri(uri: string): Update {
    this.setSource(new LandSource(uri));
    return this;
  }

  get source(): LandSource {
    return this._source;
  }

  update(): void {
    this._gateModel.update();
  }

  private _gateModel: GateStore;
  private _source: LandSource;
}
