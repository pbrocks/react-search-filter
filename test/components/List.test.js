import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import { stub } from 'sinon';

import { ListComponent } from '../../src/components/List';
import H from '../helpers';
import { list } from '../fixtures';


describe('<List />', () => {
  it('renders', () => {
    const wrapper = shallow(
      <ListComponent
        currentListOption={0}
        list={fromJS(list)}
        handleClickout={H.VOID}
        handleListItemClick={H.VOID}
      />,
    );
    expect(wrapper.find('.rsf__filters-container').length).toEqual(1);
  });

  it('calls handleClickout', () => {
    const handleClickoutStub = stub();
    const wrapper = shallow(
      <ListComponent
        currentListOption={0}
        list={fromJS(list)}
        handleClickout={handleClickoutStub}
        handleListItemClick={H.VOID}
      />,
    );

    const instance = wrapper.instance();
    instance.handleClickout();
    expect(handleClickoutStub.callCount).toEqual(1);
  });
});
