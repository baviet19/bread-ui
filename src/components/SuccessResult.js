
import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

const SuccessResult = ({ match, location, history, test }) => {


  console.log(test);
  return (
    <div style={{ margin: '100px auto' }}>
      <Result
        status='success'
        title='Successfully Ordered!'
        subTitle={`Order number: ${test} `}
        extra={[
          <Link to='/myorder'>
            <Button type='primary' key='console'>
              Go Your Order
            </Button>
          </Link>,
          <Link to='/'>
            <Button key='buy'>Buy Continue</Button>
          </Link>,
        ]}
      />
    </div>
  );
};

export default SuccessResult;
