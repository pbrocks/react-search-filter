import React, { Component } from 'react';
import wrapWithClickout from 'react-clickout';

export class InputComponent extends Component {
  handleClickout = () => {
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶🌶');
    console.log('CLICKOUT FROM INPUT!!!!!!!!!!!');
    this.props.handleClickout();
  }
  render() {
    const { inputRef, onChange, onKeyDown, onClick, onBlur, search, className } = this.props;
    console.log('🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳');
    console.log('search:', search);
    return (
      <input
        className={className}
        ref={inputRef}
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        onClick={onClick}
        onBlur={onBlur}
        value={search}
        autoFocus
      />
    );
  }
}

export default wrapWithClickout(InputComponent);
