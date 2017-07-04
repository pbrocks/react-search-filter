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
} from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,
  data: List,
  isListVisible: boolean,
  isTraversingList: boolean,
  combinations: List,
  currentInput: string,
  currentListOption: Number,
  currentCombination: Number,
  list: List,

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

  onChange = (e: Object) => {
    this.props.setCurrentInput({ id: this.props.id, currentInput: e.target.value });
    this.props.filterList({ id: this.props.id, currentInput: e.target.value });
    if (this.props.isTraversingList) {
    }
  }

  handleSearch = () => {
    this.setState({ searchSent: true }, () => {
      const { combinations } = this.props;
      console.log('combinations.toJS():', combinations.toJS());
    });
    // maybe save to state, so we can access the callback functionality
    // this.props.handleSearch({ filter: currentFilter, search: this.input.value });
  }

  onKeyDown = (e: Object) => {
    const { id } = this.props;
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

      this.props.setListVisibility({ id, isListVisible: false });
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
        this.props.incrementCurrentCombination({ id });
        // setTimeout(() => this.handleSearch(), 1000);
        this.handleSearch();
      }
    }
  }

  onClick = () => {
    const { id } = this.props;
    this.props.setListVisibility({ id, isListVisible: true });
    // this.props.setCombinationStep({ id, step:})
  }

  handleFilterItemClick = (filter, index: Number) => () => {
    const { id } = this.props;
    this.props.setCombinationFilterOnClick({ id, filter, index });
    this.props.setListVisibility({ id, isListVisible: false });
    this.input.focus();
  }

  handleCombinationItemClick = (id, index) => () => {
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

  render() {
    const { id, list, combinations, isListVisible, currentInput } = this.props;


    return (
      <div className="rsf__wrapper">
        <div className="rsf__search-container">

          {combinations && combinations.map((c, index) => (
            <div
              className="rsf__combination-item"
              onClick={this.handleCombinationItemClick(id, index)}
            >
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
            {list.map((f, index) => (
              <div
                key={f.get('id')}
                className={this.generateFilterStyle(index)}
                onClick={this.handleFilterItemClick(f, index)}
              >
                {`${f.get('display')} :`}
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
  currentListOption: state.searchFilter.getIn([ownProps.id, 'currentListOption']),
  list: state.searchFilter.getIn([ownProps.id, 'list']),
  options: state.searchFilter.getIn([ownProps.id, 'options']),
  combinations: state.searchFilter.getIn([ownProps.id, 'combinations']),
  currentCombination: state.searchFilter.getIn([ownProps.id, 'currentCombination']),
  currentInput: state.searchFilter.getIn([ownProps.id, 'currentInput']),
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
  setCurrentInput,
  incrementCurrentCombination,
  setListTraversal,
  filterList,
  deleteCombination,
  resetList,
};

const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

// const connected = connect(mapStateToProps, mapDispatchToProps)(SearchFilterComponent);
const connected = connect(mapStateToProps, mapDispatchToProps)(Wrapped);

export default connected;
