// @flow
import Immutable, { fromJS } from 'immutable';
import uuid from 'uuid';
import C from '../constants';
import initialState from './initial_state';
import initialStateRSF from './initial_state_rsf';

import type { Action, DataState, Reducer } from '../types';

const defaultFilter = fromJS({
  id: 0,
  display: 'Search',
  value: 'search',
});

const reducer: Reducer = (state: DataState = fromJS(initialState), action: Action) => {
  switch (action.type) {

    /* --- TOP LEVEL ------------------------ */
    case C.RSF_ADD_RSF: {
      const { id } = action.data;

      if (!id) return state;
      return state.merge({
        [id]: initialStateRSF,
      });
    }

    case C.RSF_REMOVE_RSF: {
      const { id } = action.data;
      return state.delete(id);
    }

    /* --- COMBINATION ------------------------ */
    case C.RSF_SET_COMBINATION_FILTER: {
      const { id, index } = action.data;
      const currentListOption = state.getIn([id, 'currentListOption']);
      const filter = state.getIn([id, 'list', currentListOption]);
      const updatedState = state.setIn([id, 'combinations', index, 'filter'], filter);
      return updatedState;
    }

    case C.RSF_SET_COMBINATION_FILTER_ON_CLICK: {
      const { id, filter, index } = action.data;
      const current = state.getIn([id, 'currentCombination']);
      const updatedState = state
        .setIn([id, 'combinations', current, 'filter'], filter)
        .setIn([id, 'currentListOption'], index);
      return updatedState;
    }

    case C.RSF_ADD_COMBINATION_COMPLETE: {
      const { id, currentSearch } = action.data;
      console.log('🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌');
      console.log('currentSearch:', currentSearch);
      const options = state.getIn([id, 'options']);
      console.log('options:', options);

      const filteredOptions = options.filter(option => currentSearch.has(option.get('value')));

      const combos = filteredOptions.reduce((result, option, index, original) => {
        const combo = Immutable.Map()
          .set('filter', original.get(index))
          .set('search', currentSearch.get(option.get('value')));
        return result.push(combo);
      }, fromJS([]));
      console.log('combos:', combos);
      const updatedState = state.setIn([id, 'combinations'], combos)
        .setIn([id, 'combinationsReady'], true);
      return updatedState;
      // return state;
    }

    case C.RSF_ADD_COMBINATION: {
      const { id } = action.data;
      const size = state.getIn([id, 'combinations']).size;
      const updatedState = state.setIn([id, 'combinations', size], fromJS({
        isEditing: true,
        isListVisible: true,
      })).setIn([id, 'globalIsEditing'], true);
      return updatedState;
    }

    case C.RSF_DELETE_COMBINATION: {
      const { id, index } = action.data;
      const updatedState = state.deleteIn([id, 'combinations', index]);
      return updatedState;
    }

    case C.RSF_SET_COMBINATION_SEARCH: {
      const { id, index, search, isReady = false } = action.data;
      const combination = state.getIn([id, 'combinations', index]);
      let updatedState = state;

      if (!combination.get('filter')) {
        updatedState = state.setIn([id, 'combinations', index, 'filter'], defaultFilter)
        .setIn([id, 'combinations', index, 'search'], search)
        .setIn([id, 'isReady'], isReady);
      } else {
        updatedState = state
        .setIn([id, 'combinations', index, 'search'], search)
        .setIn([id, 'isReady'], isReady);
      }

      const combinations = updatedState.getIn([id, 'combinations']);
      const combinedSearch = combinations.reduce((result, combo) => {
        const key = combo.getIn(['filter', 'value']);
        const value = combo.get('search');
        return result.set([key], value);
      }, fromJS({}));

      const finalState = updatedState
        .setIn([id, 'search'], combinedSearch)
        .setIn([id, 'combinations', index, 'isListVisible'], false);
      return finalState;
    }

    case C.RSF_SET_COMBINATION_LIST_VISIBILITY: {
      const { id, index, isListVisible } = action.data;
      const updatedState = state.setIn([id, 'combinations', index, 'isListVisible'], isListVisible);
      return updatedState;
    }

    case C.RSF_SET_COMBINATION_EDITING: {
      const { id, index, isEditing } = action.data;
      const updatedState = state.setIn([id, 'combinations', index, 'isEditing'], isEditing);
      return updatedState;
    }

    /* --- LIST ------------------------ */
    case C.RSF_INITIALIZE_LIST: {
      const { id, data } = action.data;
      const options = data.map(f => fromJS({
        id: uuid.v4(),
        display: f.get('display'),
        value: f.get('value'),
      }));

      return state.setIn([id, 'list'], data)
        .setIn([id, 'options'], options)
        .setIn([id, 'currentListOption'], null)
        .setIn([id, 'currentCombination'], 0);
    }

    case C.RSF_RESET_LIST: {
      const { id } = action.data;
      const options = state.getIn([id, 'options']);
      const size = state.getIn([id, 'combinations']).size;

      const updatedState = state.setIn([id, 'list'], options)
        .setIn([id, 'currentListOption'], null)
        .setIn([id, 'globalIsEditing'], false)
        .setIn([id, 'currentCombination'], size)
        .setIn([id, 'isReady'], true);
      return updatedState;
    }

    case C.RSF_SET_LIST_VISIBILITY: {
      const { id, isListVisible } = action.data;
      return state.setIn([id, 'isListVisible'], isListVisible);
    }

    case C.RSF_BROWSE_LIST_UP: {
      const { id } = action.data;
      const currentListOption = state.getIn([id, 'currentListOption']);
      const size = state.getIn([id, 'list']).size;
      let updatedListOption = currentListOption - 1;
      if (updatedListOption < 0) {
        updatedListOption = size - 1;
      }
      return state.setIn([id, 'currentListOption'], updatedListOption);
    }

    case C.RSF_BROWSE_LIST_DOWN: {
      const { id } = action.data;
      const currentListOption = state.getIn([id, 'currentListOption']);
      const size = state.getIn([id, 'list']).size;
      let updatedListOption;
      if (currentListOption === null) {
        updatedListOption = 0;
      } else {
        updatedListOption = currentListOption + 1;
      }
      if (updatedListOption > (size - 1)) {
        updatedListOption = 0;
      }
      return state.setIn([id, 'currentListOption'], updatedListOption);
    }

    case C.RSF_FILTER_LIST: {
      const { id, currentInput } = action.data;
      const options = state.getIn([id, 'options']) || [];
      const filtered = options.filter(option => option.get('display').toLowerCase()
        .includes(currentInput.toLowerCase()));

      const updatedState = state.setIn([id, 'list'], filtered);
      return updatedState;
    }

    case C.RSF_SET_LIST_BROWSING: {
      const { id, isBrowsingList } = action.data;
      return state.setIn([id, 'isBrowsingList'], isBrowsingList);
    }


    /* --- OVERALL ------------------------ */
    case C.RSF_SET_SEARCH_READY: {
      const { id, isReady } = action.data;
      const updatedState = state.setIn([id, 'isReady'], isReady);
      return updatedState;
    }

    case C.RSF_SET_CURRENT_INPUT: {
      const { id, currentInput } = action.data;
      const updatedState = state.setIn([id, 'currentInput'], currentInput);
      return updatedState;
    }

    case C.RSF_SET_CURRENT_COMBINATION: {
      const { id, currentCombination } = action.data;
      return state.setIn([id, 'currentCombination'], currentCombination);
    }

    case C.RSF_INCREMENT_CURRENT_COMBINATION: {
      const { id } = action.data;
      const current = state.getIn([id, 'currentCombination']);
      const next = current + 1;
      const updatedState = state.setIn([id, 'currentCombination'], next);
      return updatedState;
    }

    default: {
      return state;
    }
  }
};

export default reducer;
