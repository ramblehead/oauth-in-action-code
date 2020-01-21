// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/camelcase */

import React, { useContext } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import yup from 'yup';

import { AppSessionRefContext } from '../session';

const querySchema = yup.object().shape({
  client_id: yup.string().required(),
});

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

  const client = query.client_id;

  return (
    <div>
      <p>{JSON.stringify(appSession.getClient(client))}</p>
      <p>{client}</p>
    </div>
  );
};

export default Index;
