// Hey Emacs, this is -*- coding: utf-8 -*-

import React, { useContext } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';

import { AppSessionRefContext } from '../session';


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

const Index: NextPage = () => {
  const { current: appSession } = useContext(AppSessionRefContext);

  return (
    <div>
      <Link href="/about">
        <a href="/about" title="About Page">About Page</a>
      </Link>
      <p>XXX</p>
      <button
        type="button"
        onClick={(_event): void => {
          console.log('Up!');
          appSession.count += 1;
          appSession.update();
        }}
      >
        Up!
      </button>
      <p>Up! Clicks count = {appSession.count}</p>
    </div>
  );
};

export default Index;
