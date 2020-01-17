// Hey Emacs, this is -*- coding: utf-8 -*-

import React from 'react';
import PropTypes from 'prop-types';
import { NextPage } from 'next';

const propTypes = {
  userAgent: PropTypes.string,
};

type Props = PropTypes.InferProps<typeof propTypes>;

const defaultProps = {
  userAgent: 'Undefined',
};

const page: NextPage<Props> = ({ userAgent }) => (
  <main>Your user agent: {userAgent}</main>
);

page.propTypes = propTypes;

page.defaultProps = defaultProps;

page.getInitialProps = async ({ req }): Promise<Props> => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent };
};

export default page;
