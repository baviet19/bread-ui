import { useDispatch } from 'react-redux';
import React from 'react';

import { Result, Button } from 'antd';
const NotFound = ({ match, location, history }) => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(logout());
  // }, [dispatch]);

  const checkLogout = () => {
    history.push('/');
  };

  return (
    <>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={
          <Button type='primary' onClick={checkLogout}>
            Go Home
          </Button>
        }
      />
    </>
  );
};

export default NotFound;
