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
  searchOptions: Array,
  autocomplete: Array,

  updateCombination: Callback,
  deleteCombination: Callback,
  handleAutocomplete: Callback,
  updateEditing: Callback,
};

export class CombinationComponent extends Component {
  props: CombinationProps;

  constructor(props, context) {
    super(props, context);
    const { combination, filterOptions } = props;
    // console.log('COMB: construct', combination.toArray(), filterOptions.toArray());
    this.state = {
      id: uuid.v4(),
      filter: combination.get('filter'),
      search: combination.get('search') || '',

      // we use (and set to true) isEditing/isListVisible from parent, when adding a new combination
      isEditing: combination.get('isEditing'), // same, can this be false?
      isListVisible: combination.get('isListVisible'), // this is the filter options list e.g Number, Cust, Status

      isBrowsingList: false,
      listIndex: null,
      currentList: 'filter',
      inProgress: true,

      list: filterOptions,
    };
    // console.log('curr state: ', this.state);
  }

  handleClickoutFilter = () => {
    console.log('COMB: handleClickoutFilter');
    if (!this.state.filter) {
      this.handleDeleteCombination();
    } else {
      this.setState({
        isListVisible: false,
        isEditing: false,
      });
      this.props.updateEditing(false);
    }
  }

  handleClickoutSearch = () => {
    console.log('COMB: handleClickoutSearch');
    if (!this.state.filter) {
      this.handleDeleteCombination();
    } else {
      this.setState({
        isListVisible: false,
        isEditing: false,
      });
      this.props.updateEditing(false);
    }
  }

  handleInputBlur = (e) => {
    return;
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('e:', e);
    console.log('e.relatedTarget:', e.relatedTarget);
    const { isListVisible, filter, search, isEditing, isBrowsingList } = this.state;
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('handleblur:', filter, search, isListVisible, isBrowsingList, isEditing);
    // if (isListVisible) {
    //   console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    //   console.log('Lets get out:');
    //   return;
    // }
    // if (filter && !search) {
    //   this.handleDeleteCombination();
    // }
    if (filter && search && !isListVisible) {
      this.setState({
        isListVisible: false,
        listIndex: null,
        isBrowsingList: false,
        isEditing: false,
      });
      this.handleUpdateCombination();
    }
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    const { list } = this.state;
    // console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    // console.log('handleInputChange:', value, list.toArray());
    const filtered = list.filter(item => item.get('display').toLowerCase()
      .includes(value.toLowerCase()));

    this.setState({
      search: value,
      list: filtered,
    });
  }

  handleInputKeyDown = (e: Object) => {
    // console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶handleInputKeyDown🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    // console.log('this.state.isListVisible:', this.state.isListVisible);
    // console.log('this.state.isBrowsingList:', this.state.isBrowsingList);
    if (e.which === 40) { // DOWN
      this.setState({
        // isListVisible: true,
        isBrowsingList: true,
      }, () => this.browseListDown());
    }
    if (e.which === 38) { // UP
      this.setState({
        // isListVisible: true,
        isBrowsingList: true,
      }, () => this.browseListUp());
    }

    if (e.which === 13) { // ENTER
      const { currentList, isBrowsingList } = this.state;
      // console.log("ENTER: ", currentList, isBrowsingList)
      if (isBrowsingList && currentList === 'filter') {
        // console.log('IN BROWSING LIST – FILTER');
        const { listIndex, list } = this.state;
        const filter = list.get(listIndex);
        this.setState({
          filter,
          isBrowsingList: false,
          listIndex: null,
          currentList: 'search',
          isEditing: true,
          search: '', // clear search after selecting a filter
        }, () => {
          if (currentList === 'filter') {
            // console.log('CURRENT LIST IS FILTER, GOING TO FOCUS INPUT NOW', currentList);
            this.input.focus();
          }
          this.props.updateEditing(true);
        });
      } else if (isBrowsingList && currentList === 'search') {
        // console.log('🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳');
        // console.log('WE ARE BROWSING LIST – SEARCH');
        const { listIndex } = this.state;
        const { searchOptions } = this.props;
        // console.log('listIndex:', listIndex);
        // console.log('searchOptions:', searchOptions);
        const search = searchOptions.getIn([listIndex, 'value']);
        // console.log('🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩');
        // console.log('search:', search);
        this.setState({
          isBrowsingList: false,
          listIndex: null,
          currentList: null,
          isEditing: false,
          search,
          inProgress: false,
        }, () => {
          this.handleUpdateCombination();
        });
      } else if (this.state.search.trim() === '') {
        // console.log('EMPTY STATE SEARCH, ABOUT TO DELETE');
        this.handleDeleteCombination();
      } else {
        // console.log('FALL BACK, UPDATING COMBINATION');
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
      this.props.updateEditing(false);
    }

    // handle all other keyDowns here
    const regex = /^[a-zA-Z\-?]$/;

    // if keyDown is alphanumeric, and the current filter is autocomplete-able
    if (regex.test(String.fromCharCode(e.which))) {
      const currentFilter = this.state.filter.get('value');
      const { autocomplete } = this.props;
      // console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
      // console.log('autocompleteable:', currentFilter, autocomplete);
      if (autocomplete.includes(currentFilter)) {
        const { search } = this.state;
        this.props.handleAutocomplete(currentFilter, search);
      }
    }
  }

  browseListDown = () => {
    const currentIndex = this.state.listIndex;
    const { list, isListVisible } = this.state;
    const { searchOptions } = this.props;
    const currentList = isListVisible ? list : searchOptions;
// console.log('COMB: browseListDown', currentIndex, list, searchOptions, currentList.toArray());
    if (currentIndex !== null && currentIndex + 1 < currentList.size) {
      this.setState({ listIndex: currentIndex + 1 });
    } else {
      this.setState({ listIndex: 0 });
    }
  }

  browseListUp = () => {
    const currentIndex = this.state.listIndex;
    const { list, isListVisible } = this.state;
    const { searchOptions } = this.props;
    const currentList = isListVisible ? list : searchOptions;
    // console.log('COMB: browseListUp', currentIndex, list, searchOptions, currentList.toArray());
    if (currentIndex !== null && currentIndex - 1 > -1) {
      this.setState({ listIndex: currentIndex - 1 });
    } else {
      this.setState({ listIndex: currentList.size - 1 });
    }
  }

  handleUpdateCombination = () => {
    const { search, id } = this.state;
    // console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    // console.log('search:', search);
    const { index, defaultFilter } = this.props;
    const filter = this.state.filter || defaultFilter; // search

    const combo = Immutable.Map()
      .set('id', id)
      .set('filter', filter)
      .set('search', search)
      .set('isEditing', false)
      .set('isListVisible', false);

    this.props.updateCombination(index, combo);
    this.props.updateEditing(false);
  }

  handleDeleteCombination = () => {
    // console.log('COMB: handleDeleteCombination', index);
    const { index } = this.props;
    this.props.deleteCombination(index);
    this.props.updateEditing(false);
  }

  handleListItemClick = filter => () => {
    const { search, id } = this.state;
    const { index } = this.props;
    console.log('COMB: handleListItemClick', search, id, index);
    const combo = Immutable.Map()
      .set('id', id)
      .set('filter', filter)
      .set('search', search)
      .set('isListVisible', false)
      .set('listIndex', null)
      .set('isBrowsingList', false)
      .set('currentList', 'search')
      .set('isEditing', true);
    this.setState({
      filter,
      search: '',
      isListVisible: false,
      listIndex: null,
      isBrowsingList: false,
      currentList: 'search',
      isEditing: true,
    }, () => {
      if (!search) {
        this.input.focus();
      } else {
        this.props.updateCombination(index, combo);
      }
      this.props.updateEditing(true);
    });
  }

  handleSearchListItemClick = item => () => {
    const search = item.get('value');
    const { filter, id } = this.state;
    const { index } = this.props;
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('LIST ITEM CLICKED!!!!!!!!!!!!!!!!!!:');
    console.log('COMB: handleSearchListItemClick', filter, id, index);
    const combo = Immutable.Map()
      .set('id', id)
      .set('filter', filter)
      .set('search', search)
      .set('isListVisible', false)
      .set('listIndex', null)
      .set('isBrowsingList', false)
      .set('currentList', null)
      .set('isEditing', false);
    this.setState({
      filter,
      search,
      isListVisible: false,
      listIndex: null,
      isBrowsingList: false,
      currentList: null,
      isEditing: false,
    }, () => {
      if (filter && search) {
        this.props.updateCombination(index, combo);
      } else {
        this.props.deleteCombination(index);
      }
      this.props.updateEditing(false);
    });
  }

  handleClickCombinationFilter = () => {
    console.log('COMB: handleClickCombinationFilter');
    this.setState({
      isListVisible: true,
      isEditing: true,
      currentList: 'filter',
      isBrowsingList: true,
    });
    this.props.updateEditing(true);
  }

  handleClickCombinationSearch = () => {
    console.log('COMB: handleClickCombinationSearch');
    this.setState({
      isEditing: true,
      currentList: 'search',
      isListVisible: false,
      isBrowsingList: true,
    });
    this.props.updateEditing(true);
  }

  generateInputStyle = () => {
    // console.log('COMB: generateInputStyle');
    const styles = {
      'rsf__combination-search__input': true,
      'rsf__combination-search__input--hidden': !this.state.isEditing,
    };
    return classNames(styles);
  }

  render() {
    const { filter, list, search, isEditing, listIndex, isListVisible } = this.state;
    // const autocompleteOptions = fromJS(this.props.autocompleteOptions);
    const { searchOptions } = this.props;
    // console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    // console.log('Render Comb list:', list.toArray(), searchOptions.toArray());
    // console.log('Render Comb:', isEditing, isListVisible);
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

          {isEditing && !isListVisible && searchOptions.size > 0 &&
            <List
              options={searchOptions}
              type="search"
              handleClickout={this.handleClickoutSearch}
              handleListItemClick={this.handleSearchListItemClick}
              currentListOption={listIndex}
            />
          }

        </div>

        {isListVisible && isEditing && list.size > 0 &&
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
