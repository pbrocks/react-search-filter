import React, { Component } from 'react';
import classNames from 'classnames';
import wrapWithClickout from 'react-clickout';

class ListOptionsComponent extends Component {
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
        {list.map((f, i) => (
          <div
            key={f.get('id')}
            className={this.generateFilterStyle(i)}
            onClick={handleListItemClick(f, i)}
          >
            {f.get('display')}
          </div>
        ))}
      </div>
    );
  }
}
const Wrapped = wrapWithClickout(ListOptionsComponent);

export default Wrapped;