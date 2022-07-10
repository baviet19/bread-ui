import React from 'react';
import { Spin, message } from 'antd';

const AntLoader = () => {
  const key = 'updatable';
  return message.success({ content: 'Loaded!', key, duration: 2 });
};

export default AntLoader;
