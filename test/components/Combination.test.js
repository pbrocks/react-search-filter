import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import { stub } from 'sinon';

import Combination from '../../src/components/Combination';
import H from '../helpers';
import { combination, list } from '../fixtures';


describe.only('<Combination />', () => {
  it('renders', () => {
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

  it('handles deleting a combination', () => {
    const deleteStub = stub();
    const wrapper = shallow(
      <Combination
        index={0}
        combination={fromJS(combination)}
        list={fromJS(list)}
        saveCombination={H.VOID}
        deleteCombination={deleteStub}
      />,
    );
    wrapper.find('.rsf__combination-delete').simulate('click');
    expect(deleteStub.callCount).toEqual(1);
  });

  it('handles clicking on combination search', () => {
    const wrapper = shallow(
      <Combination
        index={0}
        combination={fromJS(combination)}
        list={fromJS(list)}
        saveCombination={H.VOID}
        deleteCombination={H.VOID}
      />,
    );
    expect(wrapper.state('isEditing')).toEqual(false);
    wrapper.find('.rsf__combination-search').simulate('click');
    expect(wrapper.state('isEditing')).toEqual(true);
    console.log('wrapper.debug():', wrapper.debug());

    const input = wrapper.find('.rsf__search-input');
    expect(wrapper.state('search')).toEqual('Lugia');
    input.simulate('change', { target: { value: 'Cookie Monster' } });
    expect(wrapper.state('search')).toEqual('Cookie Monster');

    input.simulate('keyDown', { which: 40 });
    expect(wrapper.state('isListVisible')).toEqual(true);
  });

  it('handles clicking on combination filter', () => {
    const wrapper = shallow(
      <Combination
        index={0}
        combination={fromJS(combination)}
        list={fromJS(list)}
        saveCombination={H.VOID}
        deleteCombination={H.VOID}
      />,
    );
    expect(wrapper.state('isListVisible')).toEqual(false);

    wrapper.find('.rsf__combination-filter').simulate('click');
    expect(wrapper.state('isListVisible')).toEqual(true);
  });
});
