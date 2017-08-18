import React from 'react';
import { shallow, mount } from 'enzyme';
import { fromJS } from 'immutable';
import { stub } from 'sinon';

import { SearchFilterComponent } from '../../src/components/SearchFilter';
import Combination from '../../src/components/Combination';

import H from '../helpers';
import { options } from '../fixtures';

const currentSearch = {
  pokemon: 'Zapdos',
  tea: 'Earl Gray',
};

describe('<SearchFilter />', () => {
  it('renders', () => {
    const wrapper = shallow(
      <SearchFilterComponent
        options={fromJS(options)}
        currentSearch={fromJS(currentSearch)}
        handleSearch={H.VOID}
      />,
    );
    expect(wrapper.find('.rsf__wrapper').length).toEqual(1);
  });

  it('handles deleting combination', () => {
    const handleSearchStub = stub();

    const wrapper = mount(
      <SearchFilterComponent
        options={fromJS(options)}
        currentSearch={fromJS(currentSearch)}
        handleSearch={handleSearchStub}
      />,
    );

    expect(wrapper.find('.rsf__wrapper').length).toEqual(1);
    expect(wrapper.find(Combination).length).toEqual(2);
    expect(wrapper.state('combinations').size).toEqual(2);

    const deleteSegment = wrapper.find('.rsf__combination-delete');
    expect(deleteSegment.length).toEqual(2);

    deleteSegment.at(0).simulate('click');
    expect(wrapper.state('combinations').size).toEqual(1);

    expect(handleSearchStub.callCount).toEqual(1);

    const args = handleSearchStub.args[0][0];
    expect(args).toEqual({ pokemon: 'Zapdos' });
  });

  it('handles adding combination', () => {
    const wrapper = mount(
      <SearchFilterComponent
        options={fromJS(options)}
        currentSearch={fromJS(currentSearch)}
        handleSearch={H.VOID}
      />,
    );

    const addSegment = wrapper.find('.rsf__add');
    expect(addSegment.length).toEqual(1);
    expect(wrapper.state('combinations').size).toEqual(2);

    addSegment.simulate('click');
    expect(wrapper.state('combinations').size).toEqual(3);
  });

  it('handles updating combination', () => {
    const handleSearchStub = stub();
    const wrapper = mount(
      <SearchFilterComponent
        options={fromJS(options)}
        currentSearch={fromJS(currentSearch)}
        handleSearch={handleSearchStub}
      />,
    );

    const searchSegment1 = wrapper.find('.rsf__combination-search').at(1);
    searchSegment1.simulate('click');

    const inputSegment = wrapper.find('.rsf__search-input').at(0);
    inputSegment.simulate('change', { target: { value: 'Lugia' } });
    inputSegment.simulate('keydown', { which: 13 });

    expect(wrapper.state('combinations').getIn([1, 'search'])).toEqual('Lugia');
    expect(handleSearchStub.callCount).toEqual(1);
  });
});
