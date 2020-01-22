// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import React, { useContext } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import * as yup from 'yup';

import { AppSessionRefContext } from '../session';

const querySchema = yup.object().shape({
  client_id: yup.string().required(),
}).noUnknown();

type Query = yup.InferType<typeof querySchema>;

const Index: NextPage = () => {
  const { current: appSession } = useContext(AppSessionRefContext);
  const router = useRouter();

  const query = router.query as Query;

  // querySchema
  //   .isValid(query)
  //   .then(function(valid) {
  //     valid;
  //   });

  const queryIsValid = querySchema.isValidSync(query, { strict: true });
  const client = query.client_id;

  return (
    <div>
      <p>{JSON.stringify(appSession.getClient(client))}</p>
      <p>{client}</p>
      <p>{JSON.stringify(query)}</p>
      <p>{queryIsValid ? 'valid' : 'invalid'}</p>
    </div>
  );
};

export default Index;
