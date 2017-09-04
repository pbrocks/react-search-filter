// @flow
import React, { Component } from 'react';
import Immutable, { fromJS } from 'immutable';
import classNames from 'classnames';
import uuid from 'uuid';

import List from './List';

import type { Callback } from '../types';

type CombinationProps = {
  index: Number,
  combination: Map,
  defaultFilter: Map,
  filterOptions: List,
  autocomplete: Array,
  autocompleteOptions: Array,

  updateCombination: Callback,
  deleteCombination: Callback,
  handleAutocomplete: Callback,
};

export class CombinationComponent extends Component {
  props: CombinationProps;

  constructor(props, context) {
    super(props, context);
    const { combination, filterOptions } = props;
    console.log('COMB: construct', combination.toArray(), filterOptions.toArray());
    this.state = {
      id: uuid.v4(),
      filter: combination.get('filter'),
      search: combination.get('search') || '',

      // we use (and set to true) isEditing/isListVisible from parent, when adding a new combination
      isEditing: combination.get('isEditing'), // same, can this be false?
      isListVisible: combination.get('isListVisible'), // this is the filter options list e.g Number, Cust, Status

      isBrowsingList: false,
      listIndex: null,

      list: filterOptions,
    };
    console.log('curr state: ', this.state);
  }

  handleClickoutFilter = () => {
    console.log('COMB: handleClickoutFilter');
    if (!this.state.filter) {
      this.handleDeleteCombination();
    } else {
      this.setState({
        isListVisible: false,
      });
    }
  }

  handleClickoutSearch = () => {
    console.log('COMB: handleClickoutSearch');
    if (!this.state.filter) {
      this.handleDeleteCombination();
    } else {
      this.setState({
        isListVisible: false,
      });
    }
  }

  handleInputBlur = () => {
    console.log('COMB: handleInputBlur');
    if (this.state.filter && !this.state.search) {
      this.handleDeleteCombination();
    }
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    const { list } = this.state;

    const filtered = list.filter(item => item.get('display').toLowerCase()
      .includes(value.toLowerCase()));
    console.log('COMB: handleInputChange', value, list, filtered);
    this.setState({
      search: value,
      list: filtered,
    });
  }

  handleInputKeyDown = (e: Object) => {
    console.log('COMB: handleInputKeyDown', e.which);
    if (e.which === 40) { // DOWN
      this.setState({
        //isListVisible: true,
        isBrowsingList: true,
      }, () => this.browseListDown());
    }
    if (e.which === 38) { // UP
      this.setState({
        //isListVisible: true,
        isBrowsingList: true,
      }, () => this.browseListUp());
    }

    if (e.which === 13) { // ENTER
      if (this.state.isBrowsingList) {
        const { listIndex, list } = this.state;
        const filter = list.get(listIndex);
        this.setState({
          filter,
          isListVisible: false,
          isBrowsingList: false,
          search: '', // clear search after selecting a filter
        }, () => {
          this.input.focus();
        });
      } else if (this.state.search.trim() === '') {
        this.handleDeleteCombination();
      } else {
        this.handleUpdateCombination();
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

    // handle all other keyDowns here
    const regex = /^[a-zA-Z\-?]$/;

    // if keyDown is alphanumeric, and the current filter is autocomplete-able
    if (regex.test(String.fromCharCode(e.which))) {
      const currentFilter = this.state.filter.get('value');
      const { autocomplete } = this.props;
      if (autocomplete.includes(currentFilter)) {
        const { search } = this.state;
        this.props.handleAutocomplete(currentFilter, search);
      }
    }
  }

  browseListDown = () => {
    const currentIndex = this.state.listIndex;
    const { list } = this.state;
    console.log('COMB: browseListDown', currentIndex, list);
    if (currentIndex !== null && currentIndex + 1 < list.size) {
      this.setState({ listIndex: currentIndex + 1 });
    } else {
      this.setState({ listIndex: 0 });
    }
  }

  browseListUp = () => {
    const currentIndex = this.state.listIndex;
    const { list } = this.state;
    console.log('COMB: browseListUp', currentIndex, list);
    if (currentIndex !== null && currentIndex - 1 > -1) {
      this.setState({ listIndex: currentIndex - 1 });
    } else {
      this.setState({ listIndex: list.size - 1 });
    }
  }

  handleUpdateCombination = () => {
    const { search, id } = this.state;
    const { index, defaultFilter } = this.props;
    const filter = this.state.filter || defaultFilter; // search
    console.log('COMB: handleUpdateCombination', search, id, index, defaultFilter);
    const combo = Immutable.Map()
      .set('id', id)
      .set('filter', filter)
      .set('search', search)
      .set('isEditing', false)
      .set('isListVisible', false);

    this.props.updateCombination(index, combo);
  }

  handleDeleteCombination = () => {
    console.log('COMB: handleDeleteCombination', index);
    const { index } = this.props;
    this.props.deleteCombination(index);
  }

  handleListItemClick = filter => () => {
    const { search, id } = this.state;
    const { index } = this.props;
    console.log('COMB: handleListItemClick', search, id, index);
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

  handleSearchListItemClick = item => () => {
    const search = item.get('value');
    const { filter, id } = this.state;
    const { index } = this.props;
    console.log('COMB: handleSearchListItemClick', filter, id, index);
    const combo = Immutable.Map()
    .set('id', id)
    .set('filter', filter)
    .set('search', search);
    this.setState({
      search,
      isListVisible: false,
      listIndex: null,
    }, () => {
      this.props.updateCombination(index, combo);
    });
  }

  handleClickCombinationFilter = () => {
    console.log('COMB: handleClickCombinationFilter');
    this.setState({
      isListVisible: true,
    });
  }

  handleClickCombinationSearch = () => {
    console.log('COMB: handleClickCombinationSearch');
    this.setState({
      isEditing: true,
    });
  }

  generateInputStyle = () => {
    console.log('COMB: generateInputStyle');
    const styles = {
      'rsf__combination-search__input': true,
      'rsf__combination-search__input--hidden': !this.state.isEditing,
    };
    return classNames(styles);
  }

  render() {
    const { filter, list, search, isEditing, listIndex, isListVisible } = this.state;

    const autocompleteOptions = fromJS(this.props.autocompleteOptions);
    console.log('COMB: render: ', filter, search, isEditing);
    return (
      <div className="rsf__combination-container">

        {filter && filter.get('display') &&
          <span
            className="rsf__combination-filter"
            onClick={this.handleClickCombinationFilter}
          >
            {`${filter.get('display')} :`}
            <span
              className="om-icon-descending rsf__icon-down"
            />
          </span>
        }

        <div className="rsf__combination-search__container">
          {search && !isEditing &&
            <span
              className="rsf__combination-search__display"
              onClick={this.handleClickCombinationSearch}
            >
              {search}
            </span>
          }

          {search && !isEditing &&
            <span
              className="rsf__combination-delete"
              onClick={this.handleDeleteCombination}
            />
          }

          {isEditing &&
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
          }

          {isEditing && !isListVisible &&
            <List
              options={autocompleteOptions}
              type="search"
              handleClickout={this.handleClickoutSearch}
              handleListItemClick={this.handleSearchListItemClick}
              currentListOption={listIndex}
            />
          }

        </div>

        {isListVisible && isEditing &&
          <List
            options={list}
            type="filter"
            handleClickout={this.handleClickoutFilter}
            handleListItemClick={this.handleListItemClick}
            currentListOption={listIndex}
          />
        }

      </div>
    );
  }
}

export default CombinationComponent;
