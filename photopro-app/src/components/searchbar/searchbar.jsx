import React, { useState } from 'react';
import './searchbar.css';
import 'antd/es/input/style/css';

import { Input } from 'antd';
const { Search } = Input;

function Searchbar() {
  const [value, setValue] = useState(0);

  return (
    <div className="searchbar-container">
      <Search
        placeholder="input search text"
        enterButton="Search"
        size="large"
        onSearch={(value) => console.log(value)}
        style={{ width: '60rem' }}
      />
    </div>
  );
}

export default Searchbar;
