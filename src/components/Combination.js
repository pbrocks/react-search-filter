// @flow
import React, { Component } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import wrapWithClickout from 'react-clickout';
import classNames from 'classnames';

import type { Callback } from '../types';
import {
  addRSF,
  removeRSF,
  initializeList,
  traverseListUp,
  traverseListDown,
  setCombinationFilter,
  setCombinationListVisibility,
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
  setCombinationEditing,
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
  combination: Map,

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
  setCombinationListVisibility: Callback,
  setCurrentInput: Callback,
  incrementCurrentCombination: Callback,
  setListTraversal: Callback,
  filterList: Callback,
  deleteCombination: Callback,
  resetList: Callback,
  setCurrentCombination: Callback,
  setCurrentStep: Callback,
  setCombinationEditing: Callback,
};

export class CombinationComponent extends Component {
  props: SearchFilterProps;


  handleClickout = () => {
    this.props.setCombinationListVisibility({ id: this.props.id, isListVisible: false });
  }

  handleInputChange = (e: Object) => {
    this.props.setCurrentInput({ id: this.props.id, currentInput: e.target.value });
    this.props.filterList({ id: this.props.id, currentInput: e.target.value });
    if (this.props.isTraversingList) {
    }
  }

  handleSearch = () => {
    // this.setState({ searchSent: true }, () => {
    //   const { combinations } = this.props;
    //   console.log('combinations.toJS():', combinations.toJS());
    // });
    // maybe save to state, so we can access the callback functionality
    // this.props.handleSearch({ filter: currentFilter, search: this.input.value });
  }

  handleInputKeyDown = (e: Object) => {
    const { id, index } = this.props;
    if (e.which === 40) { // DOWN
      this.props.traverseListDown({ id: this.props.id });
      this.props.setListTraversal({ id, isTraversing: true });
    }
    if (e.which === 38) { // UP
      this.props.traverseListUp({ id: this.props.id });
      this.props.setListTraversal({ id, isTraversingList: true });
    }
    if (e.which === 13) { // ENTER
      const { currentCombination, currentInput, isTraversingList } = this.props;

      const currentFilter = this.props.combinations.getIn([currentCombination, 'filter']);

      this.props.setCombinationListVisibility({ id, isListVisible: false });
      this.props.setCurrentInput({ id, currentInput: '' });
      // if traversing List (ie. creating combinationFilter)
      // 1. set combinationFilter
      if (isTraversingList) {
        this.props.setCombinationFilter({ id });
        this.props.setListTraversal({ id, isTraversingList: false });
      } else {
        // if not traversing List
        // 1. set combinationSearch
        // 2. hit this.props.handleSearch
        if (!currentFilter) {
          this.props.setCombinationDefaultFilter({ id });
        }
        this.props.setCombinationSearch({ id, search: currentInput });
        this.props.setCombinationEditing({ id, index, isEditing: false });
        this.props.incrementCurrentCombination({ id });
        this.props.setCurrentStep({ id, currentStep: 'filter' });
        this.props.resetList({ id });
        // setTimeout(() => this.handleSearch(), 1000);
        this.handleSearch();
      }
    }
  }

  handleInputClick = () => {
    const { id, index, currentStep } = this.props;
    if (currentStep === 'search') return;
    this.props.setCombinationListVisibility({ id, index, isListVisible: true });
    // this.props.setCombinationStep({ id, step:})
  }

  handleListItemClick = (filter) => () => {
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

  handleCombinationItemClick = (id, index) => () => {
    // console.log('COMBINATION ITEM CLICKED');
    // this.props.deleteCombination({ id, index });
    // this.props.resetList({ id });
  }

  handleCombinationFilterClick = (id: string) => () => {
    console.log('COMBINATION FILTER CLICKED');
    // set currentCombination
    const { index } = this.props;
    this.props.setCurrentCombination({ id, currentCombination: index });
    this.props.setCurrentStep({ id, currentStep: 'filter' });
    this.props.setCombinationListVisibility({ id, index, isListVisible: true });
    // set currentStep to 'filter'
    // show list
    // set currentListOption to the one already chosen?
    // figure out how to set listOpen on hover?

  }

  handleCombinationSearchClick = (id: string) => () => {
    console.log('COMBINATION SEARCH CLICKED');
    const { index } = this.props;
    const search = this.props.combinations.getIn([index, 'search']);
    this.props.setCurrentCombination({ id, currentCombination: index });
    this.props.setCombinationSearch({ id, search: '' });
    this.props.setCurrentStep({ id, currentStep: 'search' });
    this.props.setCurrentInput({ id, currentInput: search });
    this.props.setCombinationEditing({ id, index, isEditing: true });
    // this.input.focus();


    // setTimeout(() => this.input.focus(), 1000);
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

  generateInputStyle = () => {
    const styles = {
      'rsf__search-input': true,
      'rsf__search-input--hidden': !this.props.combination.get('isEditing'),
    };
    return classNames(styles);
  }

  render() {
    const { id, index, list, combination, isListVisible, currentInput = '' } = this.props;


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
          <div className="rsf__filters-container">
            {list.map((f, i) => (
              <div
                key={f.get('id')}
                className={this.generateFilterStyle(i)}
                onClick={this.handleListItemClick(f, i)}
              >
                {f.get('display')}
              </div>
            ))}
          </div>
        : null
        }

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isTraversingList: state.searchFilter.getIn([ownProps.id, 'isTraversingList']),
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
  setCombinationListVisibility,
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
  setCombinationEditing,
};

const Wrapped = wrapWithClickout(CombinationComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

const connected = connect(mapStateToProps, mapDispatchToProps)(CombinationComponent);


export default connected;
