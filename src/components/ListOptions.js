// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import wrapWithClickout from 'react-clickout';

type ListOptionsProps = {
  // data
  id: string,
  currentListOption: Number,
  list: List,

  // methods
  handleClickout: Callback,
  handleListItemClick: Callback,
};

class ListOptionsComponent extends Component {
  props: ListOptionsProps;

  handleClickout = () => {
    this.props.handleClickout();
  }

  generateFilterStyle = (index: Number) => {
    const filterStyles = {
      'rsf__filters-item': true,
      'rsf__filters-item--active': index === this.props.currentListOption,
    };
    const styles = classNames(filterStyles);
    return styles;
  };

  render() {
    const { list, handleListItemClick } = this.props;

    return (
      <div className="rsf__filters-container">
        {list.map((item, i) => (
          <div
            key={item.get('id')}
            className={this.generateFilterStyle(i)}
            onClick={handleListItemClick(item, i)}
          >
            {item.get('display')}
          </div>
        ))}
      </div>
    );
  }
}
const Wrapped = wrapWithClickout(ListOptionsComponent);

export default Wrapped;
