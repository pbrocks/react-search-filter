// @flow
import React, { Component } from 'react';
import Immutable, { List, fromJS } from 'immutable';
import wrapWithClickout from 'react-clickout';
import uuid from 'uuid';

import Combination from './Combination';

import type { Callback, AutocompleteOption } from '../types';

type SearchFilterProps = {
  // data
  filterOptions: List,
  autocompleteOptions: Array<AutocompleteOption>,
  currentSearch: Immutable.Map,
  defaultFilter: Immutable.Map,
  autocomplete: Array<string>,

  // methods
  handleSearch: Callback,
  handleAutocomplete: Callback,
};

const addId = (raw) => {
  let result;
  if (List.isList(raw)) {
    result = raw.map(r => r.set('id', uuid.v4()));
  }
  return result;
};

const generateInitialCombinations = (list, currentSearch, defaultFilter) => {
  console.log('SF: (outside class) generateInitialCombinations:', list, currentSearch.toArray(), defaultFilter.toArray());
  const optionsWithDefault = list.push(defaultFilter);
  const currentOptions = optionsWithDefault.filter(option => currentSearch.has(option.get('value')));
  const combos = currentOptions.reduce((result, option, index, original) => {
    const combo = Immutable.Map()
      .set('id', uuid.v4())
      .set('filter', original.get(index))
      .set('search', currentSearch.get(option.get('value')));
    return result.push(combo);
  }, fromJS([]));

  return combos;
};

export class SearchFilterComponent extends Component {
  props: SearchFilterProps;

  constructor(props, context) {
    super(props, context);
    const { filterOptions, defaultFilter, currentSearch } = props;
    const list = addId(fromJS(filterOptions));
    console.log('SF: construct combs', filterOptions, defaultFilter, currentSearch)
    const combinations = generateInitialCombinations(list, currentSearch, defaultFilter);

    this.state = {
      filterOptions: list,
      combinations,
      isEditing: false,
    };
  }

  addNewCombination = () => {
    const { combinations } = this.state;
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('a new combo:', combinations.toArray());
    // do not create a new combo if a combo is in progress
    const newCombo = fromJS({
      id: uuid.v4(),
      isEditing: true,
      isListVisible: true,
    });
    const updated = combinations.push(newCombo);
    this.setState({
      combinations: updated,
      isEditing: true,
    });
  }

  updateEditing = (editStatus) => {
    this.setState({
      isEditing: editStatus,
    });
  }

  updateCombination = (index, combo) => {
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('updateCombination:', index, combo);
    const { combinations } = this.state;
    const updated = combinations.set(index, combo);
    this.setState({
      combinations: updated,
    }, () => {
      const search = this.generateSearch(this.state.combinations).toJS();
      this.props.handleSearch(search); // from parent (OrdersListCard)
    });
  }

  deleteCombination = (index) => {
    const { combinations } = this.state;
    const updated = combinations.delete(index);
    this.setState({
      combinations: updated,
      isEditing: false,
    }, () => {
      const search = this.generateSearch(this.state.combinations).toJS();
      this.props.handleSearch(search);
    });
  }

  generateSearch = (combinations) => {
    console.log('generateSearch: ', combinations);
    const search = combinations.reduce((result, combo) => {
      const key = combo.getIn(['filter', 'value']);
      const value = combo.get('search');
      return result.set([key], value);
    }, fromJS({}));
    return search;
  }

  handleAutocomplete = (filter, search) => {
    console.log('SF: handleAutocomplete:', filter, search);
    this.props.handleAutocomplete(filter, search);
  }

  generateDefaultFilter = () => {
    const { defaultFilter } = this.props;
    console.log('SF: generateDefaultFilter:', defaultFilter);
    const result = fromJS({
      id: uuid.v4(),
      display: defaultFilter.get('display'),
      value: defaultFilter.get('value'),
    });
    return result;
  }

  render() {
    const { combinations, filterOptions } = this.state;
    const { autocomplete, autocompleteOptions } = this.props;
    console.log('SF: render all combs: ', combinations.toArray(), autocomplete, autocompleteOptions);
    return (
      <div className="rsf__wrapper">

        {combinations && combinations.map((c, index) => (
          <Combination
            key={c.get('id')}
            index={index}
            combination={c}
            className="rsf__combination-item"
            filterOptions={filterOptions}
            searchOptions={fromJS(autocompleteOptions)}
            defaultFilter={this.generateDefaultFilter()}
            updateCombination={this.updateCombination}
            deleteCombination={this.deleteCombination}
            // rename this array to something reflecting it is an array
            autocomplete={autocomplete}
            handleAutocomplete={this.handleAutocomplete}
            updateEditing={this.updateEditing}
          />
        ))}

        {!this.state.isEditing && <div
          className="rsf__add"
          onClick={this.addNewCombination}
        ></div>}

      </div>
    );
  }
}


const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

export default Wrapped;
