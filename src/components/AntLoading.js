import React from 'react';
import { Spin, Alert, Layout } from 'antd';
const AntLoader = () => {
  return (
    <div style={{ margin: '200px auto' }}>
      <Spin tip='Loading...'></Spin>
    </div>
  );
};

export default AntLoader;
