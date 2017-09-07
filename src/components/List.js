// @flow
import React, { Component } from 'react';
import classNames from 'classnames';

type ListOptionsProps = {
  // data
  currentListOption: Number,
  options: List,
  type: string,

  // methods
  handleClickout: Callback,
  handleListItemClick: Callback,
};

export class ListComponent extends Component {
  props: ListOptionsProps;ListComponent

  generateItemStyles = (index: Number) => {
    const itemStyles = {
      'rsf__list-item': true,
      'rsf__list-item--active': index === this.props.currentListOption,
    };
    const styles = classNames(itemStyles);
    return styles;
  };

  render() {
    const { options, handleListItemClick, type } = this.props;

    const containerStyles = {
      'rsf__list-container': true,
      [`rsf__list-container--${type}`]: true,
    };
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('re render list:', type);
    return (
      <div
        className={classNames(containerStyles)}
      >
        {options.size > 0 && options.map((item, i) => (
          <div
            key={item.get('id')}
            className={this.generateItemStyles(i)}
            onClick={handleListItemClick(item)}
          >
            <div
              className="rsf__list-item-display"
              data-react-clickout="exclude"
            >
              {item.get('display')}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ListComponent;
