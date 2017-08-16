import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import Combination from '../../src/components/Combination';
import H from '../helpers';
import { combination, list } from '../fixtures';


describe('<CombinationComponent />', () => {
  it.only('renders', () => {
    const wrapper = shallow(
      <Combination
        index={0}
        combination={fromJS(combination)}
        list={fromJS(list)}
        saveCombination={H.VOID}
        deleteCombination={H.VOID}
      />,
    );
    expect(wrapper.find('.rsf__combination-container').length).toEqual(1);
  });
});
