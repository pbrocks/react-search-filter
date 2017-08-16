import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import Combination from '../../src/components/CombinationNew';
import H from '../helpers';

const list = [{
  id: 0,
  display: 'Coffee',
  value: 'coffee',
}, {
  id: 1,
  display: 'Tea',
  value: 'tea',
}, {
  id: 2,
  display: 'Pokemon',
  value: 'pokemon',
}];

const combination = {
  filter: list[2],
  search: 'Lugia',
  isEditing: false,
  isListVisible: false,
};


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
