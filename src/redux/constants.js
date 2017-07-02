const ACTIONS = [
  'RSF_ADD_RSF',
  'RSF_REMOVE_RSF',
];

const populatedActions = {};

for (const action of ACTIONS) {
  populatedActions[action] = action;
}

export default populatedActions;
