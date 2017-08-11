// @flow
import React, { Component } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import wrapWithClickout from 'react-clickout';
import classNames from 'classnames';

import ListOptions from './ListOptions';

import type { Callback } from '../types';
import {
  addRSF,
  removeRSF,
  initializeList,
  traverseListUp,
  browseListDown,
  setCombinationFilter,
  setCombinationListVisibility,
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
  setCombinationEditing,
  setSearchReady,
  finalizeBar,
} from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,
  index: Number,
  data: List,
  isListVisible: boolean,
  isBrowsingList: boolean,
  combinations: List,
  currentInput: string,
  currentStep: string,
  currentListOption: Number,
  currentCombination: Number,
  list: List,
  combination: Map,

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
  setCombinationListVisibility: Callback,
  setCurrentInput: Callback,
  incrementCurrentCombination: Callback,
  setListBrowsing: Callback,
  filterList: Callback,
  deleteCombination: Callback,
  resetList: Callback,
  setCurrentCombination: Callback,
  setCurrentStep: Callback,
  setCombinationEditing: Callback,
  finalizeBar: Callback,
};

export class CombinationComponent extends Component {
  props: SearchFilterProps;

  constructor(props, context) {
    super(props, context);
    this.state = {
      search: '',
    };
  }

  handleClickout = () => {
    const { id, index } = this.props;
    this.props.setCombinationListVisibility({ id, index, isListVisible: false });
  }

  handleInputChange = (e: Object) => {
    this.props.setCurrentInput({ id: this.props.id, currentInput: e.target.value });
    this.props.filterList({ id: this.props.id, currentInput: e.target.value });
    if (this.props.isBrowsingList) {
    }
  }

  handleInputKeyDown = (e: Object) => {
    const { id, index, currentStep } = this.props;

    if (e.which === 40) { // DOWN
      if (currentStep === 'search') return;
      this.props.browseListDown({ id: this.props.id });
      this.props.setListBrowsing({ id, isBrowsingList: true });
    }
    if (e.which === 38) { // UP
      if (currentStep === 'search') return;
      this.props.traverseListUp({ id: this.props.id });
      this.props.setListBrowsing({ id, isBrowsingList: true });
    }
    if (e.which === 13) { // ENTER
      const { currentCombination, currentInput, index, isBrowsingList } = this.props;

      this.props.setCurrentInput({ id, currentInput: '' });

      if (isBrowsingList) {
        this.props.setCombinationFilter({ id, index });
        this.props.setListBrowsing({ id, isBrowsingList: false });

        this.input.focus();
        return;
      }

      this.props.setCombinationSearch({ id, index, search: currentInput, isReady: true });
      this.props.setCombinationEditing({ id, index, isEditing: false });
      this.props.incrementCurrentCombination({ id });
      this.props.setCurrentStep({ id, currentStep: 'filter' });

      this.props.resetList({ id });
    }

    if (e.which === 8) { // BACKSPACE

    }

    if (e.which === 27) { // ESCAPE
      this.props.setCurrentInput({ id, currentInput: '' });
      this.props.setCombinationListVisibility({ id, index, isListVisible: false });
    }
  }

  handleInputClick = () => {
    const { id, index, currentStep } = this.props;
    if (currentStep === 'search') return;
    this.props.setCombinationListVisibility({ id, index, isListVisible: true });
  }

  handleListItemClick = filter => () => {
    const { id, combinations, combination, currentCombination, index } = this.props;
    this.props.setCurrentCombination({ id, currentCombination: index });
    this.props.setCombinationFilterOnClick({ id, filter, index });
    if (!combinations.getIn([currentCombination, 'search'])) {
      // skip this when editing filter for existing combination
      this.props.setCurrentStep({ id, currentStep: 'search' });
    } else {
      // after editing filter for existing combination, jump to next combination
      this.props.resetList({ id });
    }
    this.props.setCombinationListVisibility({ id, index, isListVisible: false });
    if (!combination.get('search')) {
      this.input.focus();
    }
  }

  handleCombinationFilterClick = (id: string) => () => {
    const { index } = this.props;
    this.props.setCurrentCombination({ id, currentCombination: index });
    this.props.setCurrentStep({ id, currentStep: 'filter' });
    this.props.setCombinationListVisibility({ id, index, isListVisible: true });
  }

  handleCombinationSearchClick = (id: string) => () => {
    const { index } = this.props;
    const search = this.props.combinations.getIn([index, 'search']);
    this.props.setCurrentCombination({ id, currentCombination: index });
    this.props.setCombinationSearch({ id, search: '' });
    this.props.setCurrentStep({ id, currentStep: 'search' });
    this.props.setCurrentInput({ id, currentInput: search });
    this.props.setCombinationEditing({ id, index, isEditing: true });
  }

  handleCombinationDelete = (id: string, index: Number) => () => {
    this.props.deleteCombination({ id, index });
    this.props.resetList({ id });
  }

  generateInputStyle = () => {
    const styles = {
      'rsf__search-input': true,
      'rsf__search-input--hidden': !this.props.combination.get('isEditing'),
    };
    return classNames(styles);
  }

  render() {
    const { id, index, list, combination, currentInput = '' } = this.props;

    return (
      <div className="rsf__combination-container">

        {combination.getIn(['filter', 'display'])
        ?
          <span
            className="rsf__combination-filter"
            onClick={this.handleCombinationFilterClick(id, index)}
          >
            {`${combination.getIn(['filter', 'display'])} :`}
            <span
              className="om-icon-descending rsf__icon-down"
            />
          </span>
        : null
        }

        {combination.get('search')
        ?
          <span
            className="rsf__combination-search"
            onClick={this.handleCombinationSearchClick(id, index)}
          >
            {combination.get('search')}
          </span>
        : null
      }

        {combination.get('search')
        ?
          <span
            className="rsf__combination-delete"
            onClick={this.handleCombinationDelete(id, index)}
          />
        : null
        }

        {combination.get('isEditing')
        ?
          <input
            ref={(r) => { this.input = r; }}
            className={this.generateInputStyle()}
            type="text"
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            onClick={this.handleInputClick}
            value={currentInput}
            autoFocus
          />
        : null }


        {combination.get('isListVisible')
        ?
          <ListOptions
            list={list}
            handleClickout={this.handleClickout}
            handleListItemClick={this.handleListItemClick}
            currentListOption={this.props.currentListOption}
          />
        : null
        }

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isBrowsingList: state.searchFilter.getIn([ownProps.id, 'isBrowsingList']),
  currentListOption: state.searchFilter.getIn([ownProps.id, 'currentListOption']),
  list: state.searchFilter.getIn([ownProps.id, 'list']),
  options: state.searchFilter.getIn([ownProps.id, 'options']),
  combinations: state.searchFilter.getIn([ownProps.id, 'combinations']),
  combination: state.searchFilter.getIn([ownProps.id, 'combinations', ownProps.index]),
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
  setCombinationListVisibility,
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
  setCombinationEditing,
  setSearchReady,
};

const Wrapped = wrapWithClickout(CombinationComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

const connected = connect(mapStateToProps, mapDispatchToProps)(CombinationComponent);


export default connected;
