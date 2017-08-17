import React from 'react';
import { shallow, mount } from 'enzyme';
import { fromJS } from 'immutable';
import { stub } from 'sinon';

import Combination from '../../src/components/Combination';
import H from '../helpers';
import { combination, list } from '../fixtures';


describe('<Combination />', () => {
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

  it('handles clicking on combination search, and sets filter and search', () => {
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

    const input = wrapper.find('.rsf__search-input');
    expect(wrapper.state('search')).toEqual('Lugia');
    input.simulate('change', { target: { value: 'Cookie Monster' } });
    expect(wrapper.state('search')).toEqual('Cookie Monster');

    expect(wrapper.state('listIndex')).toEqual(null);

    input.simulate('keyDown', { which: 40 }); // DOWN
    expect(wrapper.state('isListVisible')).toEqual(true);
    expect(wrapper.state('listIndex')).toEqual(0);

    input.simulate('keyDown', { which: 38 }); // UP
    expect(wrapper.state('isListVisible')).toEqual(true);
    expect(wrapper.state('listIndex')).toEqual(2);
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

  it('handles filtering list upon input change', () => {
    const comboNew = {
      id: 0,
      isEditing: true,
      isListVisible: true,
    };
    const wrapper = mount(
      <Combination
        index={0}
        combination={fromJS(comboNew)}
        list={fromJS(list)}
        saveCombination={H.VOID}
        deleteCombination={H.VOID}
      />,
    );

    expect(wrapper.find('.rsf__filters-item').length).toEqual(3);
    const input = wrapper.find('.rsf__search-input');

    input.simulate('change', { target: { value: 'P' } });

    expect(wrapper.find('.rsf__filters-item').length).toEqual(1);
    expect(wrapper.find('.rsf__filters-item').text()).toEqual('Pokemon');
  });

  it('handles backspace key', () => {
    const wrapper = mount(
      <Combination
        index={0}
        combination={fromJS(combination)}
        list={fromJS(list)}
        saveCombination={H.VOID}
        deleteCombination={H.VOID}
      />,
    );

    expect(wrapper.find('.rsf__filters-item').length).toEqual(0);
    expect(wrapper.state('search')).toEqual('Lugia');

    const searchSegment = wrapper.find('.rsf__combination-search');
    searchSegment.simulate('click');

    const input = wrapper.find('.rsf__search-input');
    input.simulate('keydown', { which: 8 });

    expect(wrapper.state('search')).toEqual('');

    input.simulate('keydown', { which: 8 });
    expect(wrapper.state('filter')).toEqual(null);
    expect(wrapper.state('isListVisible')).toEqual(true);
  });
});
