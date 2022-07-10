import { useDispatch } from 'react-redux';
import React  from 'react';
import { Result, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
const CartFoundRessult = ({ match, location, history, test }) => {
 

  const goHome = () => {
    history.push('/');
  };

  return (
    <div style={{ margin: '100px auto' }}>
      <Result
        icon={<SmileOutlined />}
        title='Opps, Cart Found!'
        extra={
          <Button type='primary' onClick={goHome}>
            Home
          </Button>
        }
      />
    </div>
  );
};

export default CartFoundRessult;
