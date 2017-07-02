// @flow
import { fromJS } from 'immutable';
import C from './constants';
import initialState from './initial_state';
import initialStateRSF from './initial_state_rsf';

import type { Action, DataState, Reducer } from '../types';


const reducer: Reducer = (state: DataState = fromJS(initialState), action: Action) => {
  switch (action.type) {
    // Add a React Search Filter
    case C.RSF_ADD_RSF: {
      const { id } = action.data;
      console.log('id:', id);
      console.log('state:', state);
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

    default: {
      return state;
    }
  }
};

export default reducer;
