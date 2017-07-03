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
  setFilters,
  traverseFiltersUp,
  traverseFiltersDown,
  setCombinationFilter,
  setListVisibility,
  setCombinationFilterOnClick,
  setListTraversal,
  setCombinationSearch,
  setCurrentInput,
  incrementCurrentCombination,
} from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,
  filters: List,
  isListVisible: boolean,
  isTraversingList: boolean,
  combinations: List,
  currentInput: string,
  currentCombination: Number,

  // methods
  addRSF: Callback,
  removeRSF: Callback,
  handleSearch: Callback,
  setFilters: Callback,
  traverseFiltersDown: Callback,
  traverseFiltersUp: Callback,
  setCombinationFilter: Callback,
  setCombinationFilterOnClick: Callback,
  setCombinationSearch: Callback,
  setListVisibility: Callback,
  setCurrentInput: Callback,
  incrementCurrentCombination: Callback,
  setListTraversal: Callback,
};

export class SearchFilterComponent extends Component {
  props: SearchFilterProps;

  componentDidMount() {
    const { filters, id } = this.props;
    this.props.addRSF({ id });
    this.props.setFilters({ id, filters });
  }

  componentWillUnmount() {
    this.props.removeRSF({ id: this.props.id });
  }

  handleClickout = () => {
    this.props.setListVisibility({ id: this.props.id, isListVisible: false });
  }

  onChange = (e: Object) => {
    this.props.setCurrentInput({ id: this.props.id, currentInput: e.target.value });
  }

  onKeyDown = (e: Object) => {
    const { id } = this.props;
    if (e.which === 40) { // DOWN
      this.props.traverseFiltersDown({ id: this.props.id });
      this.props.setListTraversal({ id, isTraversing: true });
    }
    if (e.which === 38) { // UP
      this.props.traverseFiltersUp({ id: this.props.id });
      this.props.setListTraversal({ id, isTraversingList: true });
    }
    if (e.which === 13) { // ENTER
      const { currentCombination, currentInput, isTraversingList } = this.props;

      const currentFilter = this.props.combinations.getIn([currentCombination, 'filter']);

      this.props.setListVisibility({ id, isListVisible: false });
      // if traversing List (ie. creating combinationFilter)
      // 1. set combinationFilter
      if (isTraversingList) {
        this.props.setCombinationFilter({ id });
        this.props.setListTraversal({ id, isTraversingList: false });
      } else {
        // if not traversing List
        // 1. set combinationSearch
        // 2. hit this.props.handleSearch
        this.props.setCombinationSearch({ id, search: currentInput });
        this.props.setCurrentInput({ id, currentInput: '' });
        this.props.incrementCurrentCombination({ id });
        this.props.handleSearch({ filter: currentFilter, search: this.input.value });
      }
    }
  }

  onClick = () => {
    this.props.setListVisibility({ id: this.props.id, isListVisible: true });
  }

  handleFilterItemClick = (filter, index: Number) => () => {
    this.props.setCombinationFilterOnClick({ id: this.props.id, filter, index });
    this.props.setListVisibility({ id: this.props.id, isListVisible: false });
    this.input.focus();
  }

  generateFilterStyle = (index: Number) => {
    const current = this.props.searchFilter
     ? this.props.searchFilter.get('hover')
     : 0;

    const filterStyles = {
      'rsf__filters-item': true,
      'rsf__filters-item--active': index === current,
    };
    const styles = classNames(filterStyles);
    return styles;
  }

  render() {
    const { filters, combinations, isListVisible, currentInput } = this.props;

    return (
      <div className="rsf__wrapper">
        <div className="rsf__search-container">

          {combinations && combinations.map(c => (
            <div className="rsf__combination-item">
              <span className="rsf__combination-filter">
                {`${c.getIn(['filter', 'display'])} :`}
              </span>
              {c.get('search')
              ?
                <span className="rsf__combination-search">
                  {c.get('search')}
                </span>
              : null
              }
            </div>
          ))}

          <input
            ref={(r) => { this.input = r; }}
            className="rsf__search-input"
            type="text"
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onClick={this.onClick}
            value={currentInput}
          />
        </div>

        {isListVisible
        ?
          <div className="rsf__filters-container">
            {filters.map((f, index) => (
              <div
                className={this.generateFilterStyle(index)}
                onClick={this.handleFilterItemClick(f, index)}
              >
                {`${f.get('display')} : `}
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
  isListVisible: state.searchFilter.getIn([ownProps.id, 'isListVisible']),
  hover: state.searchFilter.getIn([ownProps.id, 'hover']),
  searchFilter: state.searchFilter.get(ownProps.id),
  filterList: state.searchFilter.getIn([ownProps.id, 'filterList']),
  combinations: state.searchFilter.getIn([ownProps.id, 'combinations']),
  currentCombination: state.searchFilter.getIn([ownProps.id, 'currentCombination']),
  currentInput: state.searchFilter.getIn([ownProps.id, 'currentInput']),
});

const mapDispatchToProps = {
  addRSF,
  removeRSF,
  setFilters,
  traverseFiltersUp,
  traverseFiltersDown,
  setCombinationFilter,
  setListVisibility,
  setCombinationFilterOnClick,
  setCombinationSearch,
  setCurrentInput,
  incrementCurrentCombination,
  setListTraversal,
};

const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

// const connected = connect(mapStateToProps, mapDispatchToProps)(SearchFilterComponent);
const connected = connect(mapStateToProps, mapDispatchToProps)(Wrapped);

export default connected;
