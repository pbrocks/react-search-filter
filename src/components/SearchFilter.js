// @flow
import React from 'react';

import type { Callback } from '../types';

type SearchFilterProps = {
  handleSearch: Callback,
};


const SearchFilter = (props: SearchFilterProps) => {
  const { handleSearch } = props;

  const onChange = (e) => {
    handleSearch(e.target.value);
  };

  return (
    <div className="rsf__wrapper">
      <div className="rsf__search-container">
        <input
          className="rsf__search-input"
          type="text"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchFilter;
