const ACTIONS = [
  'RSF_ADD_RSF',
  'RSF_REMOVE_RSF',

  'RSF_SET_FILTERS',
  'RSF_MOVE_HOVER_UP',
  'RSF_MOVE_HOVER_DOWN',
  'RSF_SET_COMBINATION_FILTER',
  'RSF_SET_COMBINATION_FILTER_ON_CLICK',
  'RSF_SET_COMBINATION_SEARCH',

  'RSF_SET_LIST_VISIBILITY',
  'RSF_SET_CURRENT_INPUT',
];

const populatedActions = {};

for (const action of ACTIONS) {
  populatedActions[action] = action;
}

export default populatedActions;
