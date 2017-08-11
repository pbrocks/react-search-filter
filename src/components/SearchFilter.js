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

const connected = connect(mapStateToProps, mapDispatchToProps)(Wrapped);

export default connected;
