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

const setCurrentInput: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_CURRENT_INPUT,
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
  setCombinationFilterOnClick,
  setCombinationSearch,

  setListVisibility,
  setCurrentInput,
};
