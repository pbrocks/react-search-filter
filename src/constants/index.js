const ACTIONS = [
  'RSF_ADD_RSF',
  'RSF_REMOVE_RSF',

  'RSF_INITIALIZE_LIST',
  'RSF_BROWSE_LIST_UP',
  'RSF_BROWSE_LIST_DOWN',
  'RSF_SET_COMBINATION_FILTER',
  'RSF_SET_COMBINATION_DEFAULT_FILTER',
  'RSF_SET_COMBINATION_FILTER_ON_CLICK',
  'RSF_SET_COMBINATION_SEARCH',
  'RSF_SET_COMBINATION_LIST_VISIBILITY',
  'RSF_SET_COMBINATION_EDITING',
  'RSF_ADD_COMBINATION',

  'RSF_SET_LIST_VISIBILITY',
  'RSF_SET_LIST_BROWSING',

  'RSF_SET_CURRENT_INPUT',
  'RSF_SET_CURRENT_COMBINATION',

  'RSF_SET_SEARCH_READY',

  'RSF_FILTER_LIST',

  'RSF_DELETE_COMBINATION',

  'RSF_RESET_LIST',

  'RSF_INCREMENT_CURRENT_COMBINATION',

  'RSF_FINALIZE_BAR',
];

const populatedActions = {};

for (const action of ACTIONS) {
  populatedActions[action] = action;
}

export default populatedActions;