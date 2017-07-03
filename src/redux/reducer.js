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

    case C.RSF_MOVE_HOVER_UP: {
      const { id } = action.data;
      const hover = state.getIn([id, 'hover']);
      const size = state.getIn([id, 'filterList']).size;
      console.log('size:', size);
      let newHover = hover - 1;
      if (newHover < 0) {
        newHover = size - 1;
      }
      return state.setIn([id, 'hover'], newHover);
    }

    case C.RSF_MOVE_HOVER_DOWN: {
      const { id } = action.data;
      const hover = state.getIn([id, 'hover']);
      const size = state.getIn([id, 'filterList']).size;
      let newHover = hover + 1;
      if (newHover > (size - 1)) {
        newHover = 0;
      }
      return state.setIn([id, 'hover'], newHover);
    }

    case C.RSF_SET_COMBINATION_FILTER: {
      const { id } = action.data;
      const current = state.getIn([id, 'currentCombination']);
      const hover = state.getIn([id, 'hover']);
      const filter = state.getIn([id, 'filterList', hover]);
      const updatedState = state.setIn([id, 'combinations', current, 'filter'], filter);
      return updatedState;
    }

    case C.RSF_SET_COMBINATION_FILTER_ON_CLICK: {
      const { id, filter, index } = action.data;
      const current = state.getIn([id, 'currentCombination']);
      const updatedState = state
        .setIn([id, 'combinations', current, 'filter'], filter)
        .setIn([id, 'hover'], index);
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

    //
    case C.RSF_SET_FILTERS: {
      const { id, filters } = action.data;
      const data = filters.map(f => fromJS({
        id: uuid.v4(),
        display: f.get('display'),
        value: f.get('value'),
      }));

      const first = data.getIn(['0', 'id']);

      return state.setIn([id, 'filterList'], data)
        .setIn([id, 'hover'], 0)
        .setIn([id, 'currentCombination'], 0);
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
