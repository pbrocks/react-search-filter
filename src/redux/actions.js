/* @flow */

import C from './constants';
import type { ActionCreator } from '../types';

// Add a React Search Filter
const addRSF: ActionCreator = (data: Object) => ({
  type: C.RSF_ADD_RSF,
  data,
});

// Save filters
const initializeList: ActionCreator = (data: Object) => ({
  type: C.RSF_INITIALIZE_LIST,
  data,
});

const traverseListUp: ActionCreator = (data: Object) => ({
  type: C.RSF_TRAVERSE_LIST_UP,
  data,
});

const traverseListDown: ActionCreator = (data: Object) => ({
  type: C.RSF_TRAVERSE_LIST_DOWN,
  data,
});

const setCombinationFilter: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_COMBINATION_FILTER,
  data,
});

const setCombinationSearch: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_COMBINATION_SEARCH,
  data,
});

const setCombinationFilterOnClick: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_COMBINATION_FILTER_ON_CLICK,
  data,
});

const setListVisibility: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_LIST_VISIBILITY,
  data,
});

const setListTraversal: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_LIST_TRAVERSAL,
  data,
});

const setCurrentInput: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_CURRENT_INPUT,
  data,
});

const filterList: ActionCreator = (data: Object) => ({
  type: C.RSF_FILTER_LIST,
  data,
});

const incrementCurrentCombination: ActionCreator = (data: Object) => ({
  type: C.RSF_INCREMENT_CURRENT_COMBINATION,
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

  initializeList,
  traverseListUp,
  traverseListDown,

  setCombinationFilter,
  setCombinationFilterOnClick,
  setCombinationSearch,

  setListVisibility,
  setListTraversal,
  setCurrentInput,

  filterList,

  incrementCurrentCombination,
};
