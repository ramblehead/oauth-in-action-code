// Hey Emacs, this is -*- coding: utf-8 -*-

import { AuthoriseInput } from '../shared/authorise';

export interface CodeRecord {
  authoriseInput: AuthoriseInput;
  scope: string[];
}
