// @flow
import React, { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import wrapWithClickout from 'react-clickout';

import Combination from './Combination';

import type { Callback } from '../types';
import {
  addRSF,
  removeRSF,
  setListVisibility,
  initializeList,
  addCombination,
  addCombinationComplete,
} from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,
  data: Immutable.List,
  globalIsEditing: boolean,
  combinations: Immutable.List,
  currentSearch: Immutable.Map,

  // methods
  addRSF: Callback,
  removeRSF: Callback,
  setListVisibility: Callback,
  initializeList: Callback,
  addCombination: Callback,
  addCombinationComplete: Callback,
};

export class SearchFilterComponent extends Component {
  props: SearchFilterProps;

  componentDidMount() {
    const { data, id } = this.props;
    this.props.addRSF({ id });
    this.props.initializeList({ id, data });

    // generate combinations from current search here
  }


  componentWillReceiveProps(nextProps) {

    console.log('nextProps.currentSearch:', nextProps.currentSearch);
    console.log('this.props.currentSearch:', this.props.currentSearch);
    const { combinations } = this.props;
    const { currentSearch } = nextProps;


      // if combinations is empty, then make combinations from currentSearch

    // make new combinations only if currentSearch keys aren't in combinations already

    if (nextProps.options.size > 0
      && combinations && combinations.size === 0) {
      console.log('LETS MAKE NEW COMBINATIONS');
      this.generateInitialCombinations();
    }
  }

  componentWillUnmount() {
    this.props.removeRSF({ id: this.props.id });
  }

  generateInitialCombinations = () => {
    const { id, currentSearch, options } = this.props;

    const keys = Object.keys(currentSearch);
    for (const key of keys) {
      console.log('🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳');
      const filter = options && options.size && options.find(o => o.get('value') === key);
      const search = currentSearch[key];
      this.props.addCombinationComplete({ id, filter, search });
    }
  }

  handleClickout = () => {
    this.props.setListVisibility({ id: this.props.id, isListVisible: false });
  }

  addCombination = () => {
    const { id, globalIsEditing } = this.props;
    if (globalIsEditing) return;
    this.props.addCombination({ id });
  }

  render() {
    const { id, combinations } = this.props;

    return (
      <div className="rsf__wrapper">
        <div className="rsf__search-container">

          {combinations && combinations.map((c, index) => (
            <Combination
              id={id}
              key={index} // eslint-disable-line react/no-array-index-key
              index={index}
              className="rsf__combination-item"
            />
          ))}

          <div
            className="rsf__add"
            onClick={this.addCombination}
          />

        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  globalIsEditing: state.searchFilter.getIn([ownProps.id, 'globalIsEditing']),
  combinations: state.searchFilter.getIn([ownProps.id, 'combinations']),
  options: state.searchFilter.getIn([ownProps.id, 'options']),
});

const mapDispatchToProps = {
  addRSF,
  removeRSF,
  setListVisibility,
  initializeList,
  addCombination,
  addCombinationComplete,
};

const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

const connected = connect(mapStateToProps, mapDispatchToProps)(Wrapped);

export default connected;
