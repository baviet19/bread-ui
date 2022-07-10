import React, { useRef, useState, useEffect } from 'react';

import { Input } from 'antd';
const { Search } = Input;
const SearchCustom = ({ history }) => {
  const [value, setValue] = useState('');
  const onSearch = (value) => {
    if (value.trim()) {
      history.push(`/search/${value}`);
    } else {
      history.push('/');
    }
    setValue('');
  };

  return (
    <Search
      value={value}
      style={{ margin: '16px' }}
      placeholder='input search text'
      onSearch={onSearch}
      enterButton
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchCustom;
