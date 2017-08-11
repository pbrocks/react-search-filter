// @flow
import React, { Component } from 'react';
import { List } from 'immutable';
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
} from '../redux/actions';

type SearchFilterProps = {
  // data
  id: string,
  topLevelIsEditing: boolean,
  combinations: List,

  // methods
  addRSF: Callback,
  removeRSF: Callback,
  setListVisibility: Callback,
  initializeList: Callback,
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
    const { id, combinations } = this.props;

    return (
      <div className="rsf__wrapper">
        <div className="rsf__search-container">

          {combinations && combinations.map((c, index) => (
            <Combination
              id={id}
              key={index}
              index={index}
              className="rsf__combination-item"
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
  topLevelIsEditing: state.searchFilter.getIn([ownProps.id, 'topLevelIsEditing']),
  combinations: state.searchFilter.getIn([ownProps.id, 'combinations']),
});

const mapDispatchToProps = {
  addRSF,
  removeRSF,
  setListVisibility,
  initializeList,
  addCombination,
};

const Wrapped = wrapWithClickout(SearchFilterComponent, {
  wrapperStyle: 'rsf__clickout-wrapper',
});

const connected = connect(mapStateToProps, mapDispatchToProps)(Wrapped);

export default connected;
