// @flow
import React, { Component } from 'react';
import Immutable, { fromJS } from 'immutable';
import classNames from 'classnames';
import uuid from 'uuid';

import ListOptions from './ListOptions';

import type { Callback } from '../types';

const defaultFilter = fromJS({
  id: uuid.v4(),
  display: 'Search',
  value: 'search',
});

type CombinationProps = {
  index: Number,
  data: Map,
  list: List,

  saveCombination: Callback,
};

export class CombinationComponent extends Component {
  props: CombinationProps;

  constructor(props, context) {
    super(props, context);
    const { data } = props;
    this.state = {
      id: uuid.v4(),
      filter: data.get('filter'),
      search: data.get('search'),
      isEditing: data.get('isEditing'),

      isBrowsingList: false,
      isListVisible: data.get('isListVisible'),
      listIndex: null,
    };
  }

  handleClickout = () => {
    this.setState({
      isListVisible: false,
    });
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({
      search: value,
    });
  }

  browseListDown = () => {
    const currentIndex = this.state.listIndex;
    const { list } = this.props;

    if (currentIndex !== null && currentIndex + 1 < list.size) {
      this.setState({ listIndex: currentIndex + 1 });
    } else {
      this.setState({ listIndex: 0 });
    }
  }

  browseListUp = () => {
    const currentIndex = this.state.listIndex;
    const { list } = this.props;

    if (currentIndex !== null && currentIndex - 1 > -1) {
      this.setState({ listIndex: currentIndex - 1 });
    } else {
      this.setState({ listIndex: list.size - 1 });
    }
  }

  handleSaveCombination = () => {
    const { search, id } = this.state;
    const { index } = this.props;
    const filter = this.state.filter || defaultFilter; // search
    const combo = Immutable.Map()
      .set('id', id)
      .set('filter', filter)
      .set('search', search)
      .set('isEditing', false)
      .set('isListVisible', false);

    this.props.saveCombination(index, combo);
  }

  handleInputKeyDown = (e: Object) => {
    if (e.which === 40) { // DOWN
      this.setState({ isListVisible: true }, () => this.browseListDown());
    }
    if (e.which === 38) { // UP
      this.setState({ isListVisible: true }, () => this.browseListUp());
    }

    if (e.which === 13) { // ENTER
      if (this.state.isBrowsingList) {

      }
      this.handleSaveCombination();

      this.setState({
        isListVisible: false,
      });
    }
  }

  generateInputStyle = () => {
    const styles = {
      'rsf__search-input': true,
      'rsf__search-input--hidden': !this.props.data.get('isEditing'),
    };
    return classNames(styles);
  }

  render() {
    const { list } = this.props;
    const { filter, search, isEditing, isListVisible } = this.state;

    return (
      <div className="rsf__combination-container">

        {filter && filter.get('display')
        ?
          <span
            className="rsf__combination-filter"
            onClick={this.handleCombinationFilterClick}
          >
            {`${filter.get('display')} :`}
            <span
              className="om-icon-descending rsf__icon-down"
            />
          </span>
        : null }

        {search && !isEditing
        ?
          <span
            className="rsf__combination-search"
            onClick={this.handleCombinationSearchClick}
          >
            {search}
          </span>
        : null }

        {search && !isEditing
        ?
          <span
            className="rsf__combination-delete"
            onClick={this.handleCombinationDelete}
          />
        : null }

        {isEditing
        ?
          <input
            ref={(r) => { this.input = r; }}
            className={this.generateInputStyle()}
            type="text"
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            onClick={this.handleInputClick}
            value={search}
            autoFocus
          />
        : null }


        {isListVisible
        ?
          <ListOptions
            list={list}
            handleClickout={this.handleClickout}
            handleListItemClick={() => {}}
            currentListOption={this.state.listIndex}
          />
        : null }

      </div>
    );
  }
}

export default CombinationComponent;
