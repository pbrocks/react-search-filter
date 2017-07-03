const ACTIONS = [
  'RSF_ADD_RSF',
  'RSF_REMOVE_RSF',

  'RSF_SET_FILTERS',
  'RSF_MOVE_HOVER_UP',
  'RSF_MOVE_HOVER_DOWN',
];

const populatedActions = {};

for (const action of ACTIONS) {
  populatedActions[action] = action;
}

export default populatedActions;
