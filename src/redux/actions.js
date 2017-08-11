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
  type: C.RSF_BROWSE_LIST_UP,
  data,
});

const browseListDown: ActionCreator = (data: Object) => ({
  type: C.RSF_BROWSE_LIST_DOWN,
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

const setCombinationListVisibility: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_COMBINATION_LIST_VISIBILITY,
  data,
});

const setCombinationEditing: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_COMBINATION_EDITING,
  data,
});

const setSearchReady: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_SEARCH_READY,
  data,
});

const setCombinationFilterOnClick: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_COMBINATION_FILTER_ON_CLICK,
  data,
});

const setCombinationDefaultFilter: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_COMBINATION_DEFAULT_FILTER,
  data,
});

const setListVisibility: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_LIST_VISIBILITY,
  data,
});

const setListBrowsing: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_LIST_BROWSING,
  data,
});

const setCurrentInput: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_CURRENT_INPUT,
  data,
});

const setCurrentCombination: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_CURRENT_COMBINATION,
  data,
});

const addCombination: ActionCreator = (data: Object) => ({
  type: C.RSF_ADD_COMBINATION,
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

const deleteCombination: ActionCreator = (data: Object) => ({
  type: C.RSF_DELETE_COMBINATION,
  data,
});

const resetList: ActionCreator = (data: Object) => ({
  type: C.RSF_RESET_LIST,
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
  browseListDown,

  setCombinationFilter,
  setCombinationFilterOnClick,
  setCombinationDefaultFilter,
  setCombinationSearch,
  setCombinationEditing,
  setCombinationListVisibility,
  addCombination,
  setSearchReady,

  setListVisibility,
  setListBrowsing,
  setCurrentInput,
  setCurrentCombination,
  deleteCombination,

  filterList,
  resetList,

  incrementCurrentCombination,
};
