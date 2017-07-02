/* @flow */

import C from './constants';
import type { ActionCreator } from '../types';

// Add a React Search Filter
const addRSF: ActionCreator = (data: Object) => ({
  type: C.RSF_ADD_RSF,
  data,
});

// Remove a React Search Filter
const removeRSF: ActionCreator = (data: Object) => ({
  type: C.RSF_REMOVE_RSF,
  data,
});


module.exports = {
  addRSF,
  removeRSF,
};
