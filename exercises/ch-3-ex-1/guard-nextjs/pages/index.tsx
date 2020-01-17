// Hey Emacs, this is -*- coding: utf-8 -*-

import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';

// import dynamic from 'next/dynamic';
//
// type ProcessTreeModule = typeof import('../components/ProcessTree');
//
// const ProcessTree = dynamic(
//   (): Promise<ProcessTreeModule> => (
//     import('../components/ProcessTree')
//   ),
//   { ssr: false },
// );

const Index: NextPage = () => (
  <div>
    <Link href="/about">
      <a href="/about" title="About Page">About Page</a>
    </Link>
    <p>XXX</p>
  </div>
);

export default Index;
