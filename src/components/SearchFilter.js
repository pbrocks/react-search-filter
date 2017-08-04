// @flow
import React, { Component } from 'react';
import { List, fromJS } from 'immutable';
import { connect } from 'react-redux';
import wrapWithClickout from 'react-clickout';
import classNames from 'classnames';

import Combination from './Combination';

import type { Callback } from '../types';
import {
  addRSF,
  removeRSF,
  initializeList,
  traverseListUp,
  traverseListDown,
  setCombinationFilter,
  setListVisibility,
  setCombinationDefaultFilter,
  setCombinationFilterOnClick,
  setListTraversal,
  setCombinationSearch,
  setCurrentInput,
  incrementCurrentCombination,
  filterList,
  deleteCombination,
  resetList,
  setCurrentCombination,
  setCurrentStep,
  addCombination,
} from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,
  data: List,
  isListVisible: boolean,
  isTraversingList: boolean,
  combinations: List,
  currentInput: string,
  currentStep: string,
  currentListOption: Number,
  currentCombination: Number,
  list: List,
  options: List,

  // methods
  addRSF: Callback,
  removeRSF: Callback,
  handleSearch: Callback,
  initializeList: Callback,
  traverseListDown: Callback,
  traverseListUp: Callback,
  setCombinationFilter: Callback,
  setCombinationDefaultFilter: Callback,
  setCombinationFilterOnClick: Callback,
  setCombinationSearch: Callback,
  setListVisibility: Callback,
  setCurrentInput: Callback,
  incrementCurrentCombination: Callback,
  setListTraversal: Callback,
  filterList: Callback,
  deleteCombination: Callback,
  resetList: Callback,
  setCurrentCombination: Callback,
  setCurrentStep: Callback,
  addCombination: Callback,
};

export class SearchFilterComponent extends Component {
  props: SearchFilterProps;

  componentDidMount() {
    const { data, id } = this.props;
    this.props.addRSF({ id });
    this.props.initializeList({ id, data });
  }

  componentWillUnmount() {
    this.props.removeRSF({ id: this.props.id });
  }

  handleClickout = () => {
    this.props.setListVisibility({ id: this.props.id, isListVisible: false });
  }

  handleInputChange = (e: Object) => {
    this.props.setCurrentInput({ id: this.props.id, currentInput: e.target.value });
    this.props.filterList({ id: this.props.id, currentInput: e.target.value });
    if (this.props.isTraversingList) {
    }
  }

  handleSearch = () => {
    console.log('handlesearch fire');
    // this.setState({ searchSent: true }, () => {
    //   const { combinations } = this.props;
    //   console.log('combinations.toJS():', combinations.toJS());
    // });
    // maybe save to state, so we can access the callback functionality
    // this.props.handleSearch({ filter: currentFilter, search: this.input.value });
  }

  handleInputClick = () => {
    const { id, currentStep } = this.props;
    if (currentStep === 'search') return;
    this.props.setListVisibility({ id, isListVisible: true });
    // this.props.setCombinationStep({ id, step:})
  }

  handleListItemClick = (filter, index: Number) => () => {
    const { id, combinations, currentCombination } = this.props;
    this.props.setCombinationFilterOnClick({ id, filter, index });
    if (!combinations.getIn([currentCombination, 'search'])) {
      // skip this when editing filter for existing combination
      this.props.setCurrentStep({ id, currentStep: 'search' });
    } else {
      // after editing filter for existing combination, jump to next combination
      this.props.resetList({ id });
    }
    this.props.setListVisibility({ id, isListVisible: false });
    this.input.focus();
  }

  handleCombinationItemClick = (id, index) => () => {
    // console.log('COMBINATION ITEM CLICKED');
    // this.props.deleteCombination({ id, index });
    // this.props.resetList({ id });
  }

  handleCombinationFilterClick = (id: string, index: Number) => () => {
    console.log('COMBINATION FILTER CLICKED');
    // set currentCombination
    this.props.setCurrentCombination({ id, currentCombination: index });
    this.props.setCurrentStep({ id, currentStep: 'filter' });
    this.props.setListVisibility({ id, isListVisible: true });
    // set currentStep to 'filter'
    // show list
    // set currentListOption to the one already chosen?
    // figure out how to set listOpen on hover?

  }

  handleCombinationSearchClick = (id: string, index: Number) => () => {
    console.log('COMBINATION FILTER CLICKED');
    const search = this.props.combinations.getIn([index, 'search']);
    this.props.setCurrentCombination({ id, currentCombination: index });
    this.props.setCurrentStep({ id, currentStep: 'search' });
    this.props.setCurrentInput({ id, currentInput: search });
    // set currentCOmbination to index
    // set currentStep to 'search'
    // remove combinationSearch??
    // set currentInput to search
  }

  handleCombinationDelete = (id: string, index: Number) => () => {
    this.props.deleteCombination({ id, index });
    this.props.resetList({ id });
  }

  generateFilterStyle = (index: Number) => {
    const { currentListOption } = this.props;

    const filterStyles = {
      'rsf__filters-item': true,
      'rsf__filters-item--active': index === currentListOption,
    };
    const styles = classNames(filterStyles);
    return styles;
  }

  isEditing = () => {
    const { combinations } = this.props;
    console.log('\n\n\n\ncombinations:', combinations);
    for (const combination of combinations) {
      if (combination.get('isEditing')) return true;
    }
    return false;
  }

  addCombination = () => {
    console.log('YOYOYO:');
    const { id, combinations, data } = this.props;
    if (!this.props.options.size) {
      this.props.addRSF({ id });
      this.props.initializeList({ id, data });
    }
    if (this.isEditing()) {
      return;
    }
    const newFilter = fromJS({});
    const size = combinations.size;
    // this.props.setCombinationFilterOnClick({ id, filter: newFilter, index: size, isEditing: true });
    console.log('about to add a thing');
    this.props.addCombination({ id });
  }

  render() {
    const { id, list, combinations, isListVisible, currentInput = '' } = this.props;


    return (
      <div className="rsf__wrapper">
        <div
          className="rsf__search-container"
          onClick={this.addCombination}
        >
          {combinations && combinations.map((c, index) => (
            <Combination
              id={id}
              key={index}
              index={index}
              combination={c}
              className="rsf__combination-item"
              handleInputChange={this.handleInputChange}
              handleInputClick={this.handleInputClick}
              isListVisible={isListVisible}
              list={list}
              generateFilterStyle={this.generateFilterStyle}
              handleListItemClick={this.handleListItemClick}
              handleSearch={this.handleSearch}
              addCombination={this.addCombination}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isTraversingList: state.searchFilter.getIn([ownProps.id, 'isTraversingList']),
  isListVisible: state.searchFilter.getIn([ownProps.id, 'isListVisible']),
  currentListOption: state.searchFilter.getIn([ownProps.id, 'currentListOption']),
  list: state.searchFilter.getIn([ownProps.id, 'list']),
  options: state.searchFilter.getIn([ownProps.id, 'options']),
  combinations: state.searchFilter.getIn([ownProps.id, 'combinations']),
  currentCombination: state.searchFilter.getIn([ownProps.id, 'currentCombination']),
  currentInput: state.searchFilter.getIn([ownProps.id, 'currentInput']),
  currentStep: state.searchFilter.getIn([ownProps.id, 'currentStep']),
});

const mapDispatchToProps = {
  addRSF,
  removeRSF,
  initializeList,
  traverseListUp,
  traverseListDown,
  setCombinationFilter,
  setListVisibility,
  setCombinationFilterOnClick,
  setCombinationDefaultFilter,
  setCombinationSearch,
  setCurrentCombination,
  setCurrentStep,
  setCurrentInput,
  incrementCurrentCombination,
  setListTraversal,
  filterList,
  deleteCombination,
  resetList,
  addCombination,
};

const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

const connected = connect(mapStateToProps, mapDispatchToProps)(SearchFilterComponent);
// const connected = connect(mapStateToProps, mapDispatchToProps)(Wrapped);

export default connected;
