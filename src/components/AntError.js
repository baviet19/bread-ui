import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import { logout } from '../actions/userActions.js';
const AntError = ({ match, location, history }) => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(logout());
  // }, [dispatch]);

  const checkLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

  return (
    <div style={{ margin: '50px auto' }}>
      <Result
        status='403'
        title='403'
        subTitle='Sorry, you are not authorized to access this page.'
        extra={
          <Button type='primary' onClick={checkLogout}>
            Login agian
          </Button>
        }
      />
    </div>
  );
};

export default AntError;
