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
  type: C.RSF_SET_COMBINATION_VALUE,
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

const setListTraversal: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_LIST_TRAVERSAL,
  data,
});

const setCurrentInput: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_CURRENT_INPUT,
  data,
});

const setCurrentStep: ActionCreator = (data: Object) => ({
  type: C.RSF_SET_CURRENT_STEP,
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

const finalizeBar: ActionCreator = (data: Object) => ({
  type: C.RSF_FINALIZE_BAR,
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
  setCombinationDefaultFilter,
  setCombinationSearch,
  setCombinationEditing,
  setCombinationListVisibility,
  addCombination,
  setSearchReady,

  setListVisibility,
  setListTraversal,
  setCurrentInput,
  setCurrentStep,
  setCurrentCombination,
  deleteCombination,

  filterList,
  resetList,

  incrementCurrentCombination,

  finalizeBar,
};
