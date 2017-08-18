import React from 'react';
import { shallow, mount } from 'enzyme';
import { fromJS } from 'immutable';
import { stub } from 'sinon';

import Combination from '../../src/components/Combination';
import H from '../helpers';
import { combination, list } from '../fixtures';


describe('<Combination />', () => {
  /* --- BASIC RENDER ------------------------ */
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

  /* --- CLICK DELETE SEGMENT ------------------------ */
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

  /* --- CLICK SEARCH SEGMENT ------------------------ */
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

  /* --- CLICK FILTER SEGMENT ------------------------ */
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

  /* --- CLICKOUT ------------------------ */
  it('handles clicking away from list', () => {
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
    const instance = wrapper.instance();

    const filterSegment = wrapper.find('.rsf__combination-filter');

    filterSegment.simulate('click');
    expect(wrapper.state('isListVisible')).toEqual(true);
    instance.handleClickout();
    expect(wrapper.state('isListVisible')).toEqual(false);

    wrapper.setState({ isListVisible: true });
    wrapper.setState({ filter: null });
    instance.handleClickout();
    expect(deleteStub.callCount).toEqual(1);
  });

  /* --- BROWSE LIST ------------------------ */
  it('handles browsing list DOWN', () => {
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

    expect(wrapper.state('listIndex')).toEqual(null);
    const input = wrapper.find('.rsf__search-input');


    input.simulate('keydown', { which: 40 });
    expect(wrapper.state('isListVisible')).toEqual(true);
    expect(wrapper.state('isBrowsingList')).toEqual(true);
    expect(wrapper.state('listIndex')).toEqual(0);

    input.simulate('keydown', { which: 40 });
    expect(wrapper.state('listIndex')).toEqual(1);

    input.simulate('keydown', { which: 40 });
    expect(wrapper.state('listIndex')).toEqual(2);

    input.simulate('keydown', { which: 40 });
    expect(wrapper.state('listIndex')).toEqual(0);
  });

  it('handles browsing list UP', () => {
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

    expect(wrapper.state('listIndex')).toEqual(null);
    const input = wrapper.find('.rsf__search-input');


    input.simulate('keydown', { which: 38 });
    expect(wrapper.state('isListVisible')).toEqual(true);
    expect(wrapper.state('isBrowsingList')).toEqual(true);
    expect(wrapper.state('listIndex')).toEqual(2);

    input.simulate('keydown', { which: 38 });
    expect(wrapper.state('listIndex')).toEqual(1);

    input.simulate('keydown', { which: 38 });
    expect(wrapper.state('listIndex')).toEqual(0);

    input.simulate('keydown', { which: 38 });
    expect(wrapper.state('listIndex')).toEqual(2);
  });

  it('handles ENTER when browsing list', () => {
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

    expect(wrapper.state('listIndex')).toEqual(null);
    const input = wrapper.find('.rsf__search-input');


    input.simulate('keydown', { which: 38 });
    expect(wrapper.state('isListVisible')).toEqual(true);
    expect(wrapper.state('isBrowsingList')).toEqual(true);
    expect(wrapper.state('listIndex')).toEqual(2);

    input.simulate('keydown', { which: 38 });
    expect(wrapper.state('listIndex')).toEqual(1);
    expect(wrapper.state('filter')).toEqual(undefined);

    // hit Enter key
    input.simulate('keydown', { which: 13 });
    const { display } = list[1];
    expect(wrapper.state('filter').get('display')).toEqual(display);
    expect(wrapper.state('isBrowsingList')).toEqual(false);
    expect(wrapper.state('search')).toEqual('');
  });

  /* --- INPUT ------------------------ */
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
    const deleteStub = stub();
    const wrapper = mount(
      <Combination
        index={0}
        combination={fromJS(combination)}
        list={fromJS(list)}
        saveCombination={H.VOID}
        deleteCombination={deleteStub}
      />,
    );

    expect(wrapper.find('.rsf__filters-item').length).toEqual(0);
    expect(wrapper.state('search')).toEqual('Lugia');
    const searchSegment = wrapper.find('.rsf__combination-search');
    searchSegment.simulate('click');

    const inputSegment = wrapper.find('.rsf__search-input');
    inputSegment.simulate('click');

    wrapper.setState({ search: '' });
    inputSegment.simulate('keydown', { which: 8 });
    expect(deleteStub.callCount).toEqual(1);
  });

  it('handles escape key', () => {
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

    // Type Flareon
    input.simulate('change', { target: { value: 'Flareon' } });

    expect(wrapper.state('search')).toEqual('Flareon');
    expect(wrapper.state('isEditing')).toEqual(true);

    // Escape key
    input.simulate('keydown', { which: 27 });
    expect(wrapper.state('isEditing')).toEqual(false);
    expect(wrapper.state('isListVisible')).toEqual(false);
    expect(wrapper.state('listIndex')).toEqual(null);
    expect(wrapper.state('isBrowsingList')).toEqual(false);
  });
});
