/* @flow */

import C from './constants';
import type { ActionCreator } from '../types';

// Add a React Search Filter
const addRSF: ActionCreator = (data: Object) => ({
  type: C.RSF_ADD_RSF,
  data,
});

// Save filters
const setFilters: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_FILTERS,
  data,
});

const moveHoverUp: ActionCreator = (data: Object) => ({
  type: C.RSF_MOVE_HOVER_UP,
  data,
});

const moveHoverDown: ActionCreator = (data: Object) => ({
  type: C.RSF_MOVE_HOVER_DOWN,
  data,
});

const setCombinationFilter: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_COMBINATION_FILTER,
  data,
});

const setListVisibility: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_LIST_VISIBILITY,
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

  setFilters,
  moveHoverUp,
  moveHoverDown,
  setCombinationFilter,
  setListVisibility,
};
