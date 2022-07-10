import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AntLoader from '../components/AntLoading.js';
import { addToCart } from '../actions/cartActions';
import { userCart } from '../actions/cartActions.js';
import { CART_ADD_ITEM_RESET } from '../constants/cartConstants';
import NumberFormat from 'react-number-format';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Image,
  Typography,
  Button,
  Checkbox,
  Affix,
  Tag,
  Divider,
  message,
  Modal,
} from 'antd';
const { confirm } = Modal;
const { Title } = Typography;
const AntCart = ({ match, location, history }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const [checkAll, setCheckAll] = React.useState(false);
  const [checkedList, setCheckedList] = React.useState([]);

  const cartCreate = useSelector((state) => state.cartCreate);
  const {
    cart: cartCreated,
    loading: loadingCreateCart,
    success,
    error: errorCreate,
  } = cartCreate;

  const onGroupChangeItem = (e) => {
    
    if (e.target.checked) {
      setCheckAll(false);
      setCheckedList([...checkedList, e.target.value]);
    } else {
      setCheckAll(false);
      const index = checkedList
        .map(function (e) {
          return e.id;
        })
        .indexOf(e.target.value.id);
      
      if (index > -1) {
        // checkedList.splice(index, 1);
        // console.log('aaaaaaa', checkedList.splice(index, 1));
        setCheckedList(checkedList.filter((i) => i.id != e.target.value.id));
      }
    }
    // setCheckedList(checkedList);
  };

  const onGroupChange = (checkedList) => {
    // console.log('groupitem', checkedList);
    // setCheckedList(checkedList);
  };

  const onCheck = (e) => {
    // console.log('onCheck', e);

    if (e.target.checked) {
      setCheckAll(true);

      var d = [];
      for (var i = 0, iLen = cart.cartFoods.length; i < iLen; i++) {
        if (cart.cartFoods[i].amount === 0) {
        } else {
          d.push(cart.cartFoods[i]);
        }
      }

      setCheckedList(d);
    } else {
      setCheckAll(false);
      setCheckedList([]);
    }
    console.log('chl', checkedList);
  };

  const handleSubmit = () => {
    if (checkAll || checkedList.length > 0) {
      localStorage.setItem('checkedList', JSON.stringify(checkedList));
      history.push('/orders');

      console.log('local', JSON.parse(localStorage.getItem('checkedList')));
      console.log('submit', checkedList);
    } else {
      message.warning('This is a warning message');
    }
  };

  const handlePlus = (item) => {
    dispatch(addToCart(item.id, 1));
    setCheckAll(false);
    setCheckedList([]);
    // item.amount = item.amount + 1;
    // console.log('submit+++', item);

    console.log('checkList', checkedList);
  };

  const showConfirm = (item) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        console.log('OK');
        dispatch(addToCart(item.id, -1));
        setCheckAll(false);
        setCheckedList([]);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleMinius = (item) => {
    dispatch(addToCart(item.id, -1));
    setCheckAll(false);
    setCheckedList([]);

    // console.log('submit---', item);
  };

  const dispatch = useDispatch();
  const cartDetail = useSelector((state) => state.cart);
  const { loading, error, cart } = cartDetail;

  useEffect(() => {
    if (success) {
      console.log('jetsss');
      // message.success('Added to cart');
      dispatch({ type: CART_ADD_ITEM_RESET });
    } else if (success === false) {
      message.warning('This is a warning message');
    }
    dispatch(userCart());
  }, [dispatch, success]);

  const dispatch1 = useDispatch();

  useEffect(() => {
    if (productId) {
      dispatch1(addToCart(productId, qty));
    }
  }, [dispatch1, productId, qty]);

  // if (loading) {
  //   return <AntLoader />;
  // }

  console.log(cart);

  return loading ? (
    <AntLoader />
  ) : (
    <>
      <Row style={{ margin: '16px' }}>
        <Col span={16} style={{ margin: '16px' }}>
          <div style={{ borderBottom: '1px solid #E9E9E9' }}>
            <Checkbox onChange={onCheck} checked={checkAll}>
              Check all
            </Checkbox>
          </div>
        </Col>
      </Row>

      <Row style={{ margin: '16px' }}>
        <Col span={16}>
          {cart.cartFoods.map((item) => (
            <Checkbox.Group
              value={checkedList}
              onChange={onGroupChange}
              style={{ width: '100%' }}>
              <Row style={{ margin: '16px' }}>
                <Col span={12}>
                  <Row>
                    {item.amount !== 0 ? (
                      <Checkbox
                        value={item}
                        onChange={onGroupChangeItem}
                        
                        
                        >
                        <Title level={5}></Title>
                      </Checkbox>
                    ) : (
                      <></>
                    )}

                    <Image
                      width={200}
                      src={item.image}
                      preview={{ visible: false }}
                    />
                  </Row>
                </Col>
                <Col span={12}>
                  <Title level={4}>{item.name}</Title>

                  {/* {item.histAmount === -1 ? (
                    <Tag color='#87d068'>Updated</Tag>
                  ) : (
                    <></>
                  )} */}

                  <NumberFormat
                    style={{ color: '#0050b3' }}
                    value={item.price}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$ '}
                  />

                  {item.amount === 0 ? (
                    <Row style={{ marginTop: '16px' }}>
                      <Tag color='#f50'>Out of stock</Tag>
                    </Row>
                  ) : (
                    <></>
                  )}

                  {item.amount !== 0 ? (
                    <Row style={{ marginTop: '16px' }}>
                      <Button
                        disabled={item.amount === 0 ? true : false}
                        size='small'
                        type='primary'
                        onClick={
                          item.amount !== 1
                            ? () => handleMinius(item)
                            : () => showConfirm(item)
                        }>
                        -
                      </Button>
                      <Divider type='vertical' />

                      <Tag
                        disabled={item.amount === 0 ? true : false}
                        color='blue'
                        style={{ margin: 'initial' }}>
                        {item.amount}
                      </Tag>

                      <Divider type='vertical' />
                      <Button
                        disabled={item.amount === 0 ? true : false}
                        type='primary'
                        size='small'
                        onClick={() => handlePlus(item)}>
                        +
                      </Button>
                    </Row>
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
            </Checkbox.Group>
          ))}
        </Col>

        <Col span={8}>
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
                prefix={'$ '}
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

export default AntCart;
