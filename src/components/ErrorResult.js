import { useDispatch } from 'react-redux';
import React from 'react';
import { Result, Button } from 'antd';
import { logout } from '../actions/userActions.js';
const ErrorResult = ({ match, location, history, test }) => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(logout());
  // }, [dispatch]);

  const checkLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

  console.log(test);
  return (
    <div style={{ margin: '100px auto' }}>
      <Result
        status='warning'
        title='There are some problems with your operation.'
        extra={
          <Button type='primary' key='console'>
            Go Console
          </Button>
        }
      />
    </div>
  );
};

export default ErrorResult;
