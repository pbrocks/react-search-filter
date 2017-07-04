// @flow
import { fromJS } from 'immutable';
import C from './constants';
import initialState from './initial_state';
import initialStateRSF from './initial_state_rsf';
import uuid from 'uuid';

import type { Action, DataState, Reducer } from '../types';


const reducer: Reducer = (state: DataState = fromJS(initialState), action: Action) => {
  switch (action.type) {
    // Add a React Search Filter
    case C.RSF_ADD_RSF: {
      const { id } = action.data;

      if (!id) return state;
      return state.merge({
        [id]: initialStateRSF,
      });
    }

    // Remove a React Search Filter
    case C.RSF_REMOVE_RSF: {
      const { id } = action.data;
      return state.delete(id);
    }

    case C.RSF_TRAVERSE_LIST_UP: {
      const { id } = action.data;
      const currentListOption = state.getIn([id, 'currentListOption']);
      const size = state.getIn([id, 'list']).size;
      console.log('size:', size);
      let updatedListOption = currentListOption - 1;
      if (updatedListOption < 0) {
        updatedListOption = size - 1;
      }
      return state.setIn([id, 'currentListOption'], updatedListOption);
    }

    case C.RSF_TRAVERSE_LIST_DOWN: {
      const { id } = action.data;
      const currentListOption = state.getIn([id, 'currentListOption']);
      const size = state.getIn([id, 'list']).size;
      let updatedListOption = currentListOption + 1;
      if (updatedListOption > (size - 1)) {
        updatedListOption = 0;
      }
      return state.setIn([id, 'currentListOption'], updatedListOption);
    }

    case C.RSF_FILTER_LIST: {
      const { id, currentInput } = action.data;
      const options = state.getIn([id, 'options']) || [];
      // TODO: either lowercase / regex case insensitive
      const filtered = options.filter(f => f.get('display').includes(currentInput));

      const updatedState = state.setIn([id, 'list'], filtered);
      return updatedState;
    }

    case C.RSF_SET_LIST_TRAVERSAL: {
      const { id, isTraversing } = action.data;
      return state.setIn([id, 'isTraversingList'], isTraversing);
    }

    case C.RSF_SET_COMBINATION_FILTER: {
      const { id } = action.data;
      const current = state.getIn([id, 'currentCombination']);
      const currentListOption = state.getIn([id, 'currentListOption']);
      const filter = state.getIn([id, 'list', currentListOption]);
      const updatedState = state.setIn([id, 'combinations', current, 'filter'], filter);
      return updatedState;
    }

    case C.RSF_SET_COMBINATION_DEFAULT_FILTER: {
      const { id } = action.data;
      const current = state.getIn([id, 'currentCombination']);
      const defaultFilter = state.getIn([id, 'options', 0]);
      console.log('🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝🗝');
      console.log('defaultFilter:', defaultFilter);
      const updatedState = state.setIn([id, 'combinations', current, 'filter'], defaultFilter);
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

    case C.RSF_SET_COMBINATION_SEARCH: {
      const { id, search } = action.data;
      const current = state.getIn([id, 'currentCombination']);
      const updatedState = state.setIn([id, 'combinations', current, 'search'], search);
      return updatedState;
    }

    case C.RSF_SET_CURRENT_INPUT: {
      const { id, currentInput } = action.data;
      const updatedState = state.setIn([id, 'currentInput'], currentInput);
      return updatedState;
    }

    case C.RSF_INCREMENT_CURRENT_COMBINATION: {
      const { id } = action.data;
      const current = state.getIn([id, 'currentCombination']);
      const next = current + 1;
      const updatedState = state.setIn([id, 'currentCombination'], next);
      return updatedState;
    }

    case C.RSF_DELETE_COMBINATION: {
      const { id, index } = action.data;
      const updatedState = state.deleteIn([id, 'combinations', index]);
      return updatedState;
    }

    //
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
        .setIn([id, 'currentCombination'], size);
      return updatedState;
    }

    case C.RSF_SET_LIST_VISIBILITY: {
      const { id, isListVisible } = action.data;
      return state.setIn([id, 'isListVisible'], isListVisible);
    }

    default: {
      return state;
    }
  }
};

export default reducer;
