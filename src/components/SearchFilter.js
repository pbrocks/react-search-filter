// @flow
import React, { Component } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import wrapWithClickout from 'react-clickout';

import type { Callback } from '../types';
import { addRSF, removeRSF } from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,

  // methods
  handleSearch: Callback,
  addRSF: Callback,
  removeRSF: Callback,
  filters: List,
};

export class SearchFilterComponent extends Component {
  props: SearchFilterProps;

  componentDidMount() {
    this.props.addRSF({ id: this.props.id });
  }

  componentWillUnmount() {
    this.props.removeRSF({ id: this.props.id });
  }

  onChange = (e: Object) => {
    this.props.handleSearch(e.target.value);
  }

  onKeyDown = (e: Object) => {
    console.log('e.which:', e.which);
    if (e.which === 40) {
      console.log('OK, ARROW DOWN');
    }
    if (e.which === 38) {
      console.log('OK, ARROW UP');
    }
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
          {filters.map(f => (
            <div className="rsf__filters-item">
              {`${f.get('display')} : `}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  addRSF,
  removeRSF,
};

// const Wrapped = wrapWithClickout(SearchFilterComponent);

const connected = connect(null, mapDispatchToProps)(SearchFilterComponent);

export default connected;
