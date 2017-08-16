// @flow
import React, { Component } from 'react';
import Immutable, { fromJS } from 'immutable';
import { connect } from 'react-redux';
import wrapWithClickout from 'react-clickout';
import uuid from 'uuid';

import Combination from './CombinationNew';

import type { Callback } from '../types';
import {
  addRSF,
  removeRSF,
  setListVisibility,
  initializeList,
  addCombination,
  addCombinationComplete,
} from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,
  data: List,
  options: List,
  globalIsEditing: boolean,
  combinations: Immutable.List,
  currentSearch: Immutable.Map,

  // methods
  handleSearch: Callback,
};

export class SearchFilterComponent extends Component {
  props: SearchFilterProps;
  constructor(props, context) {
    super(props, context);
    this.state = {
      creatingCombinations: false,
      combinations: fromJS([]),
    };
  }

  componentDidMount() {
    const { options } = this.props;
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


  componentWillReceiveProps() {
  }

  componentWillUnmount() {
    this.props.removeRSF({ id: this.props.id });
  }

  generateInitialCombinations = () => {
    const { options, currentSearch } = this.props;
    const filteredOptions = options.filter(option => currentSearch.has(option.get('value')));
    const combos = filteredOptions.reduce((result, option, index, original) => {
      const combo = Immutable.Map()
        .set('filter', original.get(index))
        .set('search', currentSearch.get(option.get('value')));
      return result.push(combo);
    }, fromJS([]));
    return combos;
  }

  handleClickout = () => {
    this.props.setListVisibility({ id: this.props.id, isListVisible: false });
  }

  addNewCombination = () => {
    const { id, globalIsEditing } = this.props;
    if (globalIsEditing) return;

    const { combinations } = this.state;
    const newCombo = fromJS({
      id: uuid.v4(),
      isEditing: true,
      isListVisible: true,
    });
    const updated = combinations.push(newCombo);
    this.setState({ combinations: updated });
  }

  saveCombination = (index, combo) => {
    const { combinations } = this.state;
    const updated = combinations.set(index, combo);
    console.log('combo:', combo);
    console.log('updated:', updated);
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
              saveCombination={this.saveCombination}
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

const mapStateToProps = (state, ownProps) => ({
  globalIsEditing: state.searchFilter.getIn([ownProps.id, 'globalIsEditing']),
  combinations: state.searchFilter.getIn([ownProps.id, 'combinations']),
  // options: state.searchFilter.getIn([ownProps.id, 'options']),
  search: state.searchFilter.getIn([ownProps.id, 'search']),
  combinationsReady: state.searchFilter.getIn([ownProps.id, 'combinationsReady']),
});

const mapDispatchToProps = {
  addRSF,
  removeRSF,
  setListVisibility,
  initializeList,
  addCombination,
  addCombinationComplete,
};

const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

const connected = connect(mapStateToProps, mapDispatchToProps)(Wrapped);

export default connected;
