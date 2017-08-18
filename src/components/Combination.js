// @flow
import React, { Component } from 'react';
import Immutable, { fromJS } from 'immutable';
import classNames from 'classnames';
import uuid from 'uuid';

import List from './List';

import type { Callback } from '../types';

const defaultFilter = fromJS({
  id: uuid.v4(),
  display: 'Search',
  value: 'search',
});

type CombinationProps = {
  index: Number,
  combination: Map,
  list: List,

  updateCombination: Callback,
  deleteCombination: Callback,
};

export class CombinationComponent extends Component {
  props: CombinationProps;

  constructor(props, context) {
    super(props, context);
    const { combination, list } = props;
    this.state = {
      id: uuid.v4(),
      filter: combination.get('filter'),
      search: combination.get('search') || '',
      isEditing: combination.get('isEditing'),
      list,

      isBrowsingList: false,
      isListVisible: combination.get('isListVisible'),
      listIndex: null,
    };
  }

  handleClickout = () => {
    if (!this.state.filter) {
      this.handleDeleteCombination();
    } else {
      this.setState({
        isListVisible: false,
      });
    }
  }

  handleInputBlur = () => {
    if (this.state.filter && !this.state.search) {
      this.handleDeleteCombination();
    }
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    const { list } = this.state;
    const filtered = list.filter(item => item.get('display').toLowerCase()
      .includes(value.toLowerCase()));

    this.setState({
      search: value,
      list: filtered,
    });
  }

  handleInputKeyDown = (e: Object) => {
    if (e.which === 40) { // DOWN
      this.setState({
        isListVisible: true,
        isBrowsingList: true,
      }, () => this.browseListDown());
    }
    if (e.which === 38) { // UP
      this.setState({
        isListVisible: true,
        isBrowsingList: true,
      }, () => this.browseListUp());
    }

    if (e.which === 13) { // ENTER
      if (this.state.isBrowsingList) {
        const { listIndex, list } = this.state;
        const filter = list.get(listIndex);
        this.setState({
          filter,
          isBrowsingList: false,
          search: '', // clear search after selecting a filter
        }, () => {
          this.input.focus();
        });
      } else if (!this.state.filter || (this.state.search.trim() === '')) {
        this.handleDeleteCombination();
      } else {
        this.handleSaveCombination();
      }

      this.setState({
        isListVisible: false,
      });
    }

    if (e.which === 8) { // BACKSPACE
      // delete filter if search has been emptied by backspace
      if (!this.state.search && this.state.filter) {
        this.handleDeleteCombination();
      }
    }

    if (e.which === 27) { // ESCAPE
      this.setState({
        isEditing: false,
        isListVisible: false,
        listIndex: null,
        isBrowsingList: false,
      });
    }
  }

  browseListDown = () => {
    const currentIndex = this.state.listIndex;
    const { list } = this.state;

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

    this.props.updateCombination(index, combo);
  }

  handleDeleteCombination = () => {
    const { index } = this.props;
    this.props.deleteCombination(index);
  }

  handleListItemClick = filter => () => {
    const { search, id } = this.state;
    const { index } = this.props;
    const combo = Immutable.Map()
      .set('id', id)
      .set('filter', filter)
      .set('search', search)
      .set('isEditing', false)
      .set('isListVisible', false);
    this.setState({
      filter,
      isListVisible: false,
      listIndex: null,
    }, () => {
      if (!search) {
        this.input.focus();
      } else {
        this.props.updateCombination(index, combo);
      }
    });
  }

  handleClickCombinationFilter = () => {
    this.setState({
      isListVisible: true,
    });
  }

  handleClickCombinationSearch = () => {
    this.setState({
      isEditing: true,
    });
  }


  generateInputStyle = () => {
    const styles = {
      'rsf__search-input': true,
      'rsf__search-input--hidden': !this.state.isEditing,
    };
    return classNames(styles);
  }

  render() {
    const { filter, list, search, isEditing, listIndex, isListVisible } = this.state;

    return (
      <div className="rsf__combination-container">

        {filter && filter.get('display')
        ?
          <span
            className="rsf__combination-filter"
            onClick={this.handleClickCombinationFilter}
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
            onClick={this.handleClickCombinationSearch}
          >
            {search}
          </span>
        : null }

        {search && !isEditing
        ?
          <span
            className="rsf__combination-delete"
            onClick={this.handleDeleteCombination}
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
            onBlur={this.handleInputBlur}
            value={search}
            autoFocus
          />
        : null }


        {isListVisible
        ?
          <List
            list={list}
            handleClickout={this.handleClickout}
            handleListItemClick={this.handleListItemClick}
            currentListOption={listIndex}
          />
        : null }

      </div>
    );
  }
}

export default CombinationComponent;
