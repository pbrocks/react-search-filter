// @flow
import React, { Component } from 'react';
import ListOptions from './ListOptions';
import classNames from 'classnames';


type CombinationProps = {
  data: Map,
  list: List,
};

export class CombinationComponent extends Component {
  props: CombinationProps;

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentInput: '',
      isBrowsingList: false,
      listIndex: null,
    };
  }

  handleClickout = () => {
    console.log('CLICKOUT');
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({
      currentInput: value,
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

  handleInputKeyDown = (e: Object) => {
    if (e.which === 40) { // DOWN
      this.browseListDown();
    }
    if (e.which === 38) { // UP
      this.browseListUp();
    }

    if (e.which === 13) { // ENTER

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
    const { data, list } = this.props;
    const { currentInput } = this.state;

    return (
      <div className="rsf__combination-container">

        {data.getIn(['filter', 'display'])
        ?
          <span
            className="rsf__combination-filter"
            onClick={this.handleCombinationFilterClick}
          >
            {`${data.getIn(['filter', 'display'])} :`}
            <span
              className="om-icon-descending rsf__icon-down"
            />
          </span>
        : null
        }

        {data.get('search')
        ?
          <span
            className="rsf__combination-search"
            onClick={this.handleCombinationSearchClick}
          >
            {data.get('search')}
          </span>
        : null
        }

        {data.get('search')
        ?
          <span
            className="rsf__combination-delete"
            onClick={this.handleCombinationDelete}
          />
        : null
        }

        {data.get('isEditing')
        ?
          <input
            ref={(r) => { this.input = r; }}
            className={this.generateInputStyle()}
            type="text"
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            onClick={this.handleInputClick}
            value={currentInput}
            autoFocus
          />
        : null }


        {data.get('isListVisible')
        ?
          <ListOptions
            list={list}
            handleClickout={this.handleClickout}
            handleListItemClick={() => {}}
            currentListOption={this.state.listIndex}
          />
        : null
        }

      </div>
    );
  }
}

export default CombinationComponent;
