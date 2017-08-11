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
  browseListDown,
  setCombinationFilter,
  setListVisibility,
  setCombinationDefaultFilter,
  setCombinationFilterOnClick,
  setListBrowsing,
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
  isBrowsingList: boolean,
  topLevelIsEditing: boolean,
  combinations: List,
  currentInput: string,
  currentStep: string,
  currentListOption: Number,
  currentCombination: Number,
  list: List,

  // methods
  addRSF: Callback,
  removeRSF: Callback,
  handleSearch: Callback,
  initializeList: Callback,
  browseListDown: Callback,
  traverseListUp: Callback,
  setCombinationFilter: Callback,
  setCombinationDefaultFilter: Callback,
  setCombinationFilterOnClick: Callback,
  setCombinationSearch: Callback,
  setListVisibility: Callback,
  setCurrentInput: Callback,
  incrementCurrentCombination: Callback,
  setListBrowsing: Callback,
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

  componentWillReceiveProps() {
  }

  componentWillUnmount() {
    this.props.removeRSF({ id: this.props.id });
  }

  handleClickout = () => {
    this.props.setListVisibility({ id: this.props.id, isListVisible: false });
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

  handleCombinationFilterClick = (id: string, index: Number) => () => {
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

  handleSearch = () => {
    const { combinations } = this.props;
    const search = combinations.reduce((result, combo) => {
      console.log('result:', result);
      console.log('combo.toJS():', combo.toJS());
      const key = combo.getIn(['filter', 'value']);
      const value = combo.get('search');
      return result.set([key], value);
    }, fromJS({}));
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('search:', search);
    // this.props.handleSearch({ search });
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

  addCombination = () => {
    const { id, topLevelIsEditing } = this.props;
    if (topLevelIsEditing) return;
    this.props.addCombination({ id });
  }

  render() {
    const { id, list, combinations, isListVisible } = this.props;


    return (
      <div className="rsf__wrapper">
        <div className="rsf__search-container">

          {combinations && combinations.map((c, index) => (
            <Combination
              id={id}
              key={index}
              index={index}
              combination={c}
              className="rsf__combination-item"
              handleInputChange={this.handleInputChange}
              handleInputKeyDown={this.handleInputKeyDown}
              handleInputClick={this.handleInputClick}
              isListVisible={isListVisible}
              list={list}
              generateFilterStyle={this.generateFilterStyle}
              handleListItemClick={this.handleListItemClick}
              handleSearch={this.handleSearch}
            />
          ))}

          <div
            className="rsf__add"
            onClick={this.addCombination}
          >
          </div>

        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isBrowsingList: state.searchFilter.getIn([ownProps.id, 'isBrowsingList']),
  isListVisible: state.searchFilter.getIn([ownProps.id, 'isListVisible']),
  currentListOption: state.searchFilter.getIn([ownProps.id, 'currentListOption']),
  topLevelIsEditing: state.searchFilter.getIn([ownProps.id, 'topLevelIsEditing']),
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
  browseListDown,
  setCombinationFilter,
  setListVisibility,
  setCombinationFilterOnClick,
  setCombinationDefaultFilter,
  setCombinationSearch,
  setCurrentCombination,
  setCurrentStep,
  setCurrentInput,
  incrementCurrentCombination,
  setListBrowsing,
  filterList,
  deleteCombination,
  resetList,
  addCombination,
};

const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

// const connected = connect(mapStateToProps, mapDispatchToProps)(SearchFilterComponent);
const connected = connect(mapStateToProps, mapDispatchToProps)(Wrapped);

export default connected;
