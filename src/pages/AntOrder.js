import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AntLoader from '../components/AntLoading.js';
import { getUserDetailList } from '../actions/userActions.js';
import NumberFormat from 'react-number-format';
import { createOrder } from '../actions/orderActions.js';
import SuccessResult from '../components/SuccessResult.js';
import { userCart } from '../actions/cartActions.js';
import {
  Row,
  Col,
  Image,
  Space,
  Typography,
  Button,
  Input,
  Affix,
  Collapse,
  Radio,
  Divider,
  Tag,
  message,
} from 'antd';
import { ORDER_CREATE_RESET } from '../constants/orderConstants.js';
const { TextArea } = Input;

const { Title, Text, Link: LinkTy } = Typography;
const { Panel } = Collapse;
const AntOrder = ({ match, location, history }) => {
  const [value, setValue] = useState();
  const [checkedAddress, setCheckedAddress] = useState();

  const checkedList = JSON.parse(localStorage.getItem('checkedList'));

  const orderCreate = useSelector((state) => state.orderCreate);
  const {
    order,
    loading: loadingCreateOrder,
    success,
    error: errorCreate,
  } = orderCreate;

  const onChange1 = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
    setCheckedAddress(e.target.value);
  };

  const dispatch1 = useDispatch();
  const listUserDetail = useSelector((state) => state.userDetailList);
  const {
    loading: loadingDetails,
    error: errorDetail,
    details,
  } = listUserDetail;

  useEffect(() => {
    if (success) {
      console.log('jetsss');
      // message.success('Added to cart');

      dispatch({ type: ORDER_CREATE_RESET });
    } else if (success === false) {
      message.warning('This is a warning message');
    }
    dispatch1(getUserDetailList());
  }, [dispatch1]);

  function callback(key) {
    console.log(key);
  }

  const handleSubmit = () => {
    const orderFoods = { orderFoods: checkedList, detailId: checkedAddress.id };
    dispatch1(createOrder(orderFoods));
    console.log('submit', orderFoods);
  };

  const dispatch = useDispatch();
  const cartDetail = useSelector((state) => state.cart);
  const { loading, error, cart } = cartDetail;

  useEffect(() => {
    if (!loading && !loadingDetails) {
      if (details.length > 0) {
        console.log('de', details[0]);
        setCheckedAddress(
          details.filter((element) => element.status == 'DEFAULT')[0]
        );
      }

      if (details.length === 0) {
        history.push('/userinfo');
      }
    }
  }, [loading, loadingDetails]);

  if (loading || loadingDetails) {
    return <AntLoader />;
  }

  return typeof checkedAddress === 'undefined' ? (
    <>{checkedList.size} </>
  ) : success ? (
    <SuccessResult test={order.orderId} />
  ) : (
    <>
      {checkedList.size}
      <Row style={{ margin: '16px' }}>
        <Col span={6}>
          {/* style={{ margin: '0 auto' }} */}
          {/* <Affix offsetTop={10}> */}
          <Row style={{ margin: '16px' }}>
            <Title level={4}>Address</Title>
          </Row>

          <Row style={{ margin: '16px' }}>
            <Space direction='vertical' style={{ width: '80%' }}>
              <Row>
                <Col span={12}>
                  <Tag color='blue'>Name: </Tag>
                </Col>
                <Col span={12}>
                  <Text>{checkedAddress.firstName} </Text>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Tag color='blue'>Phone: </Tag>
                </Col>
                <Col span={12}>
                  <Text>{checkedAddress.phone} </Text>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Tag color='blue'>Address: </Tag>
                </Col>
                <Col span={12}>
                  <Text>{checkedAddress.address} </Text>
                </Col>
              </Row>
            </Space>
          </Row>

          <Collapse onChange={callback}>
            <Panel header='More' key='1'>
              <Radio.Group onChange={onChange1} value={checkedAddress}>
                {details.map((item) => (
                  <Row>
                    <Radio value={item}>
                      <Space direction='vertical'>
                        <Text>{item.firstName} </Text>
                        <Text>{item.phone} </Text>
                        <Text>{item.address} </Text>
                      </Space>
                      <Divider></Divider>
                    </Radio>
                  </Row>
                ))}
              </Radio.Group>
            </Panel>
          </Collapse>
          {/* </Affix> */}
        </Col>

        <Col span={14}>
          <Row style={{ margin: '16px' }}>
            <Title level={4}>List Product</Title>
          </Row>
          {checkedList.map((item) => (
            <Row style={{ margin: '16px' }}>
              <Col span={12}>
                <Row>
                  <Image
                    width={200}
                    src={item.image}
                    preview={{ visible: false }}
                  />
                </Row>
              </Col>
              <Col span={12}>
                <Title level={4}>{item.name}</Title>

                <NumberFormat
                  style={{ color: '#0050b3' }}
                  value={item.price}
                  displayType={'text'}
                  thousandSeparator={true}
                  suffix={'đ'}
                />

                <Row style={{ marginTop: '16px' }}>{item.amount}</Row>
              </Col>
            </Row>
          ))}
        </Col>

        <Col span={4}>
          <Affix offsetTop={10} style={{ margin: '0 auto' }}>
            <Row>
              <Title level={4}>Total Price</Title>
            </Row>
            <Row>
              <NumberFormat
                style={{ color: '#0050b3' }}
                value={checkedList.reduce(
                  (acc, item) => acc + item.amount * item.price,
                  0
                )}
                displayType={'text'}
                thousandSeparator={true}
                suffix={'đ'}
              />
            </Row>
            <Row>
              <Col style={{ marginTop: '16px' }}>
                <Button type='primary' onClick={handleSubmit}>
                  Order
                </Button>
              </Col>
              <Col></Col>
            </Row>
          </Affix>
        </Col>
      </Row>
    </>
  );
};

export default AntOrder;
