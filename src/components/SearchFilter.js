// @flow
import React, { Component } from 'react';
import Immutable, { fromJS } from 'immutable';
import wrapWithClickout from 'react-clickout';
import uuid from 'uuid';

import Combination from './Combination';

import type { Callback } from '../types';

type SearchFilterProps = {
  // data
  options: List,
  currentSearch: Map,

  // methods
  handleSearch: Callback,
};

export class SearchFilterComponent extends Component {
  props: SearchFilterProps;

  constructor(props, context) {
    super(props, context);
    const { options } = props;
    const list = options.map(option => fromJS({
      id: uuid.v4(),
      display: option.get('display'),
      value: option.get('value'),
    }));

    const combinations = this.generateInitialCombinations();

    this.state = {
      list,
      combinations,
    };
  }

  generateInitialCombinations = () => {
    const { options, currentSearch } = this.props;
    const filteredOptions = options.filter(option => currentSearch.has(option.get('value')));
    const combos = filteredOptions.reduce((result, option, index, original) => {
      const combo = Immutable.Map()
        .set('id', uuid.v4())
        .set('filter', original.get(index))
        .set('search', currentSearch.get(option.get('value')));
      return result.push(combo);
    }, fromJS([]));

    // FIXME: Generate a pill for search
    return combos;
  }

  addNewCombination = () => {
    const { combinations } = this.state;
    const newCombo = fromJS({
      id: uuid.v4(),
      isEditing: true,
      isListVisible: true,
    });
    const updated = combinations.push(newCombo);
    this.setState({ combinations: updated });
  }

  updateCombination = (index, combo) => {
    const { combinations } = this.state;
    const updated = combinations.set(index, combo);
    this.setState({
      combinations: updated,
    }, () => {
      const search = this.generateSearch(this.state.combinations).toJS();
      this.props.handleSearch(search);
    });
  }

  deleteCombination = (index) => {
    const { combinations } = this.state;
    const updated = combinations.delete(index);
    this.setState({
      combinations: updated,
    }, () => {
      const search = this.generateSearch(this.state.combinations).toJS();
      this.props.handleSearch(search);
    });
  }

  generateSearch = (combinations) => {
    const search = combinations.reduce((result, combo) => {
      const key = combo.getIn(['filter', 'value']);
      const value = combo.get('search');
      return result.set([key], value);
    }, fromJS({}));
    return search;
  }

  render() {
    const { combinations, list } = this.state;

    return (
      <div className="rsf__wrapper">
        <div className="rsf__search-container">

          {combinations && combinations.map((c, index) => (
            <Combination
              key={c.get('id')}
              index={index}
              combination={c}
              className="rsf__combination-item"
              list={list}
              updateCombination={this.updateCombination}
              deleteCombination={this.deleteCombination}
            />
          ))}

          <div
            className="rsf__add"
            onClick={this.addNewCombination}
          />

        </div>

      </div>
    );
  }
}


const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

export default Wrapped;
