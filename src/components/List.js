// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import wrapWithClickout from 'react-clickout';

type ListOptionsProps = {
  // data
  currentListOption: Number,
  list: List,
  type: string,

  // methods
  handleClickout: Callback,
  handleListItemClick: Callback,
};

export class ListComponent extends Component {
  props: ListOptionsProps;

  handleClickout = () => {
    this.props.handleClickout();
  }

  generateItemStyles = (index: Number) => {
    const itemStyles = {
      'rsf__list-item': true,
      'rsf__list-item--active': index === this.props.currentListOption,
    };
    const styles = classNames(itemStyles);
    return styles;
  };

  render() {
    const { list, handleListItemClick, type } = this.props;

    const containerStyles = {
      'rsf__list-container': true,
      [`rsf__list-container--${type}`]: true,
    };

    return (
      <div className={classNames(containerStyles)}>
        {list.map((item, i) => (
          <div
            key={item.get('id')}
            className={this.generateItemStyles(i)}
            onClick={handleListItemClick(item)}
          >
            {item.get('display')}
          </div>
        ))}
      </div>
    );
  }
}
const Wrapped = wrapWithClickout(ListComponent);

export default Wrapped;
