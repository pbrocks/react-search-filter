import { expect } from 'chai';
import { fromJS } from 'immutable';
import C from '../../src/constants';
import initialStateData from '../../src/redux/initial_state';
import reducer from '../../src/redux/reducer';

describe('Reducers', () => {
  let initialState;
  beforeEach(() => {
    initialState = fromJS(initialStateData);
  });

  /* ------------------------------------------------------------------------- */
  // DEFAULT
  it('should return the initial state', () => {
    const reducedState = reducer(initialState, 'FAKEY FAKE');
    expect(reducedState).to.deep.equal(initialState);
    expect(reducedState.size).to.equal(0);
  });

  /* ------------------------------------------------------------------------- */
  it(`should handle ${C.RSF_ADD_RSF}`, () => {
    const action = {
      type: C.RSF_ADD_RSF,
      data: {
        id: 'cookie-search',
      },
    };
    const reducedState = reducer(initialState, action);
    expect(reducedState.get('cookie-search').size).to.be.at.least(1);
    expect(reducedState.size).to.equal(1);
  });
});
