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
  moveHoverUp,
  moveHoverDown,
  setCombinationFilter,
  setListVisibility,
} from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,
  filters: List,
  isListVisible: boolean,

  // methods
  addRSF: Callback,
  removeRSF: Callback,
  handleSearch: Callback,
  setFilters: Callback,
  moveHoverDown: Callback,
  moveHoverUp: Callback,
  setCombinationFilter: Callback,
  setListVisibility: Callback,
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
    this.props.handleSearch(e.target.value);
  }

  onKeyDown = (e: Object) => {
    if (e.which === 40) { // DOWN
      this.props.moveHoverDown({ id: this.props.id });
    }
    if (e.which === 38) { // UP
      this.props.moveHoverUp({ id: this.props.id });
    }
    if (e.which === 13) { // ENTER
      this.props.setCombinationFilter({ id: this.props.id });
    }
  }

  onClick = () => {
    this.props.setListVisibility({ id: this.props.id, isListVisible: true });
  }

  generateFilterStyle = (index) => {
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
    const { filters, combinations, isListVisible } = this.props;

    return (
      <div className="rsf__wrapper">
        <div className="rsf__search-container">
          {combinations && combinations.map(c => (
            <div className="rsf__combination-item">
              <span className="rsf__combination-filter">
                {`${c.getIn(['filter', 'display'])} :`}
              </span>
              <span className="rsf__combination-search"></span>
            </div>
          ))}
          <input
            className="rsf__search-input"
            type="text"
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onClick={this.onClick}
          />
        </div>

        {isListVisible
        ?
          <div className="rsf__filters-container">
            {filters.map((f, index) => (
              <div className={this.generateFilterStyle(index)}>
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
  isListVisible: state.searchFilter.getIn([ownProps.id, 'isListVisible']),
  hover: state.searchFilter.getIn([ownProps.id, 'hover']),
  searchFilter: state.searchFilter.get(ownProps.id),
  filterList: state.searchFilter.getIn([ownProps.id, 'filterList']),
  combinations: state.searchFilter.getIn([ownProps.id, 'combinations']),
});

const mapDispatchToProps = {
  addRSF,
  removeRSF,
  setFilters,
  moveHoverUp,
  moveHoverDown,
  setCombinationFilter,
  setListVisibility,
};

const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

// const connected = connect(mapStateToProps, mapDispatchToProps)(SearchFilterComponent);
const connected = connect(mapStateToProps, mapDispatchToProps)(Wrapped);

export default connected;
