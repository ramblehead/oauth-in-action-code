// Hey Emacs, this is -*- coding: utf-8 -*-

import React from 'react';
import { NextPage } from 'next';

import { useRouter } from 'next/router';

const Index: NextPage = () => {
  const router = useRouter();

  return (
    <div>
      <p>{router.asPath}</p>
    </div>
  );
};

export default Index;
