import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/Loading.js';
import { addToCart } from '../actions/cartActions';
import { userCart } from '../actions/cartActions.js';
import {
  Row,
  Col,
  Image,
  Typography,
  Button,
  InputNumber,
  Checkbox,
  Affix,
  Radio,
  Collapse,
  Tabs,
} from 'antd';

const { Title } = Typography;

const { Panel } = Collapse;
const AntMyOrder = ({ match, location, history }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const { TabPane } = Tabs;
  const [value, setValue] = React.useState(1);
  // console.log(match);
  // console.log(location);
  // console.log(history);
  // const dispatch = useDispatch()
  // const cart = useSelector(state => state.cart)
  // const { cartItems } = cart

  // useEffect(() => {
  //     if (productId) {
  //         dispatch(addToCart(productId, qty))
  //     }
  // }, [dispatch, productId, qty])

  // const removeFromCartHandler = (id) => {
  //     dispatch(removeFromCart(id))
  // }

  // const checkoutHandler = () => {
  //     history.push('/login?redirect=shipping')
  // }

  const dispatch = useDispatch();
  const cartDetail = useSelector((state) => state.cart);
  const { loading, error, cart } = cartDetail;

  useEffect(() => {
    dispatch(userCart());
  }, [dispatch]);

  const dispatch1 = useDispatch();

  useEffect(() => {
    if (productId) {
      dispatch1(addToCart(productId, qty));
    }
  }, [dispatch1, productId, qty]);

  const checkoutHandler = () => {
    history.push('/login?redirect=placeorder');
  };

  if (loading) {
    return <Loading />;
  }

  console.log(cart);
  function onChange(value) {
    console.log('changed', value);
  }

  const CheckboxGroup = Checkbox.Group;

  const onChange1 = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  function callback(key) {
    console.log(key);
  }

  return (
    <>
      <Row style={({ margin: '0 auto' }, { padding: '35px' })}>
        <Affix offsetTop={10}>
          <Col span={4}>
            <Row>
              <Col>
                <Title level={4}>h4. Ant Design</Title>
              </Col>
              <Col>
                <Collapse onChange={callback}>
                  <Panel header='choice' key='1'>
                    <Radio.Group onChange={onChange1} value={value}>
                      <Row>
                        <Radio value={1}>A</Radio>
                      </Row>
                      <Row>
                        <Radio value={2}>B</Radio>
                      </Row>
                      <Row>
                        <Radio value={3}>C</Radio>
                      </Row>
                      <Row>
                        <Radio value={4}>D</Radio>
                      </Row>
                    </Radio.Group>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Col>
        </Affix>
        <Col span={10}>
          <Row>
            <Col>
              <Row>
                <Image
                  width={100}
                  src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                />
              </Row>
            </Col>
            <Col>
              <Title level={4}>h4. Ant Design</Title>
            </Col>
          </Row>
        </Col>
        <Affix offsetTop={10}>
          <Col span={6}>
            <Row>
              <Title level={4}>h4. Ant Design</Title>
            </Row>
            <Row>
              <InputNumber
                min={1}
                max={10}
                defaultValue={3}
                onChange={onChange}
              />
            </Row>
            <Row>
              <Col>
                <Button type='primary'>Primary Button</Button>
              </Col>
              <Col></Col>
            </Row>
          </Col>
        </Affix>
      </Row>
    </>

    // <Row>
    //   <Col md={9}>
    //     <h4>
    //       <strong>Shopping Cart</strong>
    //     </h4>
    //     {cart.cartFoods.length === 0 ? (
    //       <Message variant='info'>
    //         Your cart is empty{' '}
    //         <span className='font-weight-bold text-uppercase'>
    //           <Link to='/' className='text-decoration-none'>
    //             Back to home
    //           </Link>
    //         </span>
    //       </Message>
    //     ) : (
    //       <ListGroup variant='flush'>
    //         {cart.cartFoods.map((item) => (
    //           <ListGroup.Item key={item.id}>
    //             <Row>
    //               <Col md={3}>
    //                 <Image
    //                   src={item.image}
    //                   alt={item.name}
    //                   fluid
    //                   rounded></Image>
    //               </Col>
    //               <Col md={3} style={{ margin: 'auto' }}>
    //                 <Link
    //                   className='text-decoration-none'
    //                   to={`product/${item.id}`}>
    //                   {item.name}
    //                 </Link>
    //               </Col>
    //               <Col md={2} style={{ margin: 'auto' }}>
    //                 ${item.price}
    //               </Col>
    //               <Col md={2} style={{ margin: 'auto' }}>
    //                 {item.amount}
    //                 <Form.Control
    //                   as='select'
    //                   value={item.amount}
    //                   // onChange={(e) =>
    //                   //   dispatch(
    //                   //     addToCart(item.product, Number(e.target.value))
    //                   //   )
    //                   // }
    //                 >
    //                   {[...Array(item.countInStock).keys()].map((x) => (
    //                     <option key={x + 1} value={x + 1}>
    //                       {x + 1}
    //                     </option>
    //                   ))}
    //                 </Form.Control>
    //               </Col>
    //               <Col md={2} style={{ margin: 'auto' }}>
    //                 {/* <Button type="button" variant="light" onClick={() => removeFromCartHandler(item.product)}>
    //                                                 <i class="fas fa-trash"></i>
    //                                             </Button> */}
    //               </Col>
    //             </Row>
    //           </ListGroup.Item>
    //         ))}
    //       </ListGroup>
    //     )}
    //   </Col>
    //   <Col md={3}>
    //     <Card>
    //       <ListGroup variant='flush'>
    //         <ListGroup.Item>
    //           <h4>
    //             Subtotal (
    //             {cart.cartFoods.reduce((acc, item) => acc + item.amount, 0)})
    //             items
    //           </h4>
    //           $
    //           {cart.cartFoods.reduce(
    //             (acc, item) => acc + item.amount * item.price,
    //             0
    //           )}
    //         </ListGroup.Item>
    //         <ListGroup.Item>
    //           <div className='d-grid gap-2'>
    //             <Button
    //               onClick={checkoutHandler}
    //               type='submit'
    //               variant='primary'
    //               disabled={cart.cartFoods.length === 0}>
    //               Proceed To Checkout
    //             </Button>
    //           </div>
    //         </ListGroup.Item>
    //       </ListGroup>
    //     </Card>
    //   </Col>
    // </Row>
  );
};

export default AntMyOrder;
