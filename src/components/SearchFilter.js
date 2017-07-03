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
} from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,
  filters: List,

  // methods
  addRSF: Callback,
  removeRSF: Callback,
  handleSearch: Callback,
  setFilters: Callback,
};

export class SearchFilterComponent extends Component {
  props: SearchFilterProps;

  componentWillMount() {
    const { filters, id } = this.props;
    this.props.addRSF({ id });
    this.props.setFilters({ id, filters });
  }

  componentWillUnmount() {
    this.props.removeRSF({ id: this.props.id });
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

    }
  }

  generateFilterStyle = (index) => {
    const current = this.props.searchFilter.get('hover');

    const filterStyles = {
      'rsf__filters-item': true,
      'rsf__filters-item--active': index === current,
    };
    const styles = classNames(filterStyles);
    return styles;
  }

  render() {
    const { filters } = this.props;

    return (
      <div className="rsf__wrapper">
        <div className="rsf__search-container">
          <input
            className="rsf__search-input"
            type="text"
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            // onClick={onClick}
          />
        </div>

        <div className="rsf__filters-container">
          {filters.map((f, index) => (
            <div className={this.generateFilterStyle(index)}>
              {`${f.get('display')} : `}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return ({
    hover: state.searchFilter.getIn([ownProps.id, 'hover']),
  searchFilter: state.searchFilter.get(ownProps.id),
  filterList: state.searchFilter.getIn([ownProps.id, 'filterList']),
});
};

const mapDispatchToProps = {
  addRSF,
  removeRSF,
  setFilters,
  moveHoverUp,
  moveHoverDown,
};

// const Wrapped = wrapWithClickout(SearchFilterComponent);

const connected = connect(mapStateToProps, mapDispatchToProps)(SearchFilterComponent);

export default connected;
