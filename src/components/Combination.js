// @flow
import React, { Component } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import classNames from 'classnames';

import ListOptions from './ListOptions';

import type { Callback } from '../types';
import {
  removeRSF,
  browseListUp,
  browseListDown,
  setCombinationFilter,
  setCombinationListVisibility,
  setCombinationFilterOnClick,
  setListBrowsing,
  setCombinationSearch,
  setCurrentInput,
  incrementCurrentCombination,
  filterList,
  deleteCombination,
  resetList,
  setCurrentCombination,
  setCombinationEditing,
  setSearchReady,
} from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,
  index: Number,
  data: List,
  isListVisible: boolean,
  isBrowsingList: boolean,
  currentInput: string,
  currentListOption: Number,
  currentCombination: Number,
  list: List,
  combination: Map,

  // methods
  removeRSF: Callback,

  setCombinationFilter: Callback,
  setCombinationFilterOnClick: Callback,
  setCombinationSearch: Callback,
  setCombinationListVisibility: Callback,
  setCombinationEditing: Callback,
  deleteCombination: Callback,

  setListBrowsing: Callback,
  browseListDown: Callback,
  browseListUp: Callback,
  filterList: Callback,
  resetList: Callback,

  setCurrentInput: Callback,
  incrementCurrentCombination: Callback,
  setCurrentCombination: Callback,
};

export class CombinationComponent extends Component {
  props: SearchFilterProps;

  handleClickout = () => {
    const { id, index } = this.props;
    this.props.setCombinationListVisibility({ id, index, isListVisible: false });
  }

  handleInputChange = (e: Object) => {
    this.props.setCurrentInput({ id: this.props.id, currentInput: e.target.value });
    this.props.filterList({ id: this.props.id, currentInput: e.target.value });
  }

  handleInputKeyDown = (e: Object) => {
    const { id, index } = this.props;

    if (e.which === 40) { // DOWN
      this.props.browseListDown({ id: this.props.id });
      this.props.setListBrowsing({ id, isBrowsingList: true });
    }
    if (e.which === 38) { // UP
      this.props.browseListUp({ id: this.props.id });
      this.props.setListBrowsing({ id, isBrowsingList: true });
    }
    if (e.which === 13) { // ENTER
      const { currentInput, isBrowsingList } = this.props;

      this.props.setCurrentInput({ id, currentInput: '' });

      if (isBrowsingList) {
        this.props.setCombinationFilter({ id, index });
        this.props.setListBrowsing({ id, isBrowsingList: false });
        this.props.setCombinationListVisibility({ id, index, isListVisible: false });

        this.input.focus();
        return;
      }

      this.props.setCombinationSearch({ id, index, search: currentInput, isReady: true });
      this.props.setCombinationEditing({ id, index, isEditing: false });
      this.props.incrementCurrentCombination({ id });
      this.props.setCombinationListVisibility({ id, index, isListVisible: false });

      this.props.resetList({ id });
    }

    if (e.which === 8) { // BACKSPACE
      if (this.props.currentInput === '') {
        this.handleCombinationDelete();
      }
    }

    if (e.which === 27) { // ESCAPE
      this.props.setCurrentInput({ id, currentInput: '' });
      this.props.setCombinationListVisibility({ id, index, isListVisible: false });
    }
  }

  handleInputClick = () => {
    const { id, index } = this.props;
    this.props.setCombinationListVisibility({ id, index, isListVisible: true });
  }

  handleListItemClick = filter => () => {
    const { id, combination, index } = this.props;
    this.props.setCurrentCombination({ id, currentCombination: index });
    this.props.setCombinationFilterOnClick({ id, filter, index });
    this.props.setCombinationListVisibility({ id, index, isListVisible: false });
    if (!combination.get('search')) {
      this.input.focus();
    }
  }

  handleCombinationFilterClick = () => {
    const { id, index } = this.props;
    this.props.setCurrentCombination({ id, currentCombination: index });
    this.props.setCombinationListVisibility({ id, index, isListVisible: true });
  }

  handleCombinationSearchClick = () => {
    const { id, index, combination } = this.props;
    const search = combination.get('search');
    this.props.setCurrentCombination({ id, currentCombination: index });
    this.props.setCombinationSearch({ id, index, search: '' });
    this.props.setCurrentInput({ id, currentInput: search });
    this.props.setCombinationEditing({ id, index, isEditing: true });
  }

  handleCombinationDelete = () => {
    const { id, index } = this.props;
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
    const { list, combination, currentInput = '' } = this.props;

    return (
      <div className="rsf__combination-container">

        {combination.getIn(['filter', 'display'])
        ?
          <span
            className="rsf__combination-filter"
            onClick={this.handleCombinationFilterClick}
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
            onClick={this.handleCombinationSearchClick}
          >
            {combination.get('search')}
          </span>
        : null
      }

        {combination.get('search')
        ?
          <span
            className="rsf__combination-delete"
            onClick={this.handleCombinationDelete}
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
  combination: state.searchFilter.getIn([ownProps.id, 'combinations', ownProps.index]),
  currentCombination: state.searchFilter.getIn([ownProps.id, 'currentCombination']),
  currentInput: state.searchFilter.getIn([ownProps.id, 'currentInput']),
});

const mapDispatchToProps = {
  removeRSF,

  setCombinationFilter,
  setCombinationListVisibility,
  setCombinationFilterOnClick,
  setCombinationSearch,
  deleteCombination,
  setCombinationEditing,

  browseListUp,
  browseListDown,
  setListBrowsing,
  filterList,
  resetList,

  setCurrentInput,
  setCurrentCombination,
  setSearchReady,
  incrementCurrentCombination,
};

const connected = connect(mapStateToProps, mapDispatchToProps)(CombinationComponent);


export default connected;
