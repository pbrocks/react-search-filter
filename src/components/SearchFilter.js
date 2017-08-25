// @flow
import React, { Component } from 'react';
import Immutable, { fromJS } from 'immutable';
import wrapWithClickout from 'react-clickout';
import uuid from 'uuid';

import Combination from './Combination';

import type { Callback } from '../types';

type SearchFilterProps = {
  // data
  filterOptions: List,
  currentSearch: Map,
  defaultFilter: Map,
  autocomplete: Array,

  // methods
  handleSearch: Callback,
};

// const addId = (raw) => {
//   let result;
//   if (Array.isArray(raw)) {
//     result = raw.map(r => {
//       console.log('r:', );
//     });
//   }

// }

export class SearchFilterComponent extends Component {
  props: SearchFilterProps;

  constructor(props, context) {
    super(props, context);
    const { filterOptions } = props;
    const list = filterOptions.map(option => fromJS({
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
    const { filterOptions, currentSearch, defaultFilter } = this.props;
    const optionsWithDefault = filterOptions.push(defaultFilter);
    const currentOptions = optionsWithDefault.filter(option => currentSearch.has(option.get('value')));
    const combos = currentOptions.reduce((result, option, index, original) => {
      const combo = Immutable.Map()
        .set('id', uuid.v4())
        .set('filter', original.get(index))
        .set('search', currentSearch.get(option.get('value')));
      return result.push(combo);
    }, fromJS([]));

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

  generateDefaultFilter = () => {
    const { defaultFilter } = this.props;
    const result = fromJS({
      id: uuid.v4(),
      display: defaultFilter.get('display'),
      value: defaultFilter.get('value'),
    });
    return result;
  }

  render() {
    const { combinations, list } = this.state;
    const { autocomplete } = this.props;

    return (
      <div className="rsf__wrapper">

        {combinations && combinations.map((c, index) => (
          <Combination
            key={c.get('id')}
            index={index}
            combination={c}
            className="rsf__combination-item"
            list={list}
            defaultFilter={this.generateDefaultFilter()}
            updateCombination={this.updateCombination}
            deleteCombination={this.deleteCombination}
            autocomplete={autocomplete}
          />
        ))}

        <div
          className="rsf__add"
          onClick={this.addNewCombination}
        />

      </div>
    );
  }
}


const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

export default Wrapped;
