// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import wrapWithClickout from 'react-clickout';

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

  handleClickout = () => {
    console.log('LIST: click outside');
    this.props.handleClickout();
  }

  handleListItemClick = (item) => {
    console.log('LIST: click outside', item);
    this.props.handleListItemClick(item);
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
    const { options, handleListItemClick, type } = this.props;
    console.log('LIST: render', options.toArray(), type)
    const containerStyles = {
      'rsf__list-container': true,
      [`rsf__list-container--${type}`]: true,
    };

    return (
      <div className={classNames(containerStyles)}>
        {options.size > 0 && options.map((item, i) => (
          <div
            key={item.get('id')}
            className={this.generateItemStyles(i)}
            onClick={handleListItemClick(item)}
          >
            <div className="rsf__list-item-display">
              {item.get('display')}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
// const Wrapped = wrapWithClickout(ListComponent);

export default ListComponent;
