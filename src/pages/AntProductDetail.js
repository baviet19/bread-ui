import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../actions/productActions.js';
import NumberFormat from 'react-number-format';
import AntLoader from '../components/AntLoading';
import { addToCart } from '../actions/cartActions';
import AntError from '../components/AntError';
import { userCart } from '../actions/cartActions.js';
import {
  Row,
  Col,
  Typography,
  Button,
  Rate,
  InputNumber,
  Space,
  message,
  Carousel,
  Descriptions,
  Tag,
} from 'antd';
import { CART_ADD_ITEM_RESET } from '../constants/cartConstants';
const { Title, Paragraph } = Typography;

const contentStyle = {
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const AntProductDetail = ({ match, history }) => {
  const productId = match.params.id;
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);

  const { loading, error, product } = productDetails;
  const [qty, setQty] = useState(1);
  const cartCreate = useSelector((state) => state.cartCreate);
  const {
    cart,
    loading: loadingCreateCart,
    success,
    error: errorCreate,
  } = cartCreate;

  const addToCartHandler = () => {
    dispatch(addToCart(match.params.id, qty));
  };

  useEffect(() => {
    if (!product.name || product.foodId != productId) {
      console.log('2');
      dispatch(getProductDetails(productId));
    } else {
      console.log('3');
      console.log(product);
    }

    if (success) {
      message.success('Added to cart');
      dispatch(userCart());
      dispatch({ type: CART_ADD_ITEM_RESET });
    } else if (success === false) {
      message.warning(errorCreate);
      dispatch({ type: CART_ADD_ITEM_RESET });
    }
  }, [dispatch, productId, product, success]);

  //////////////////////

  function onChange(value) {
    setQty(value);
    console.log('changed', value);
  }

  console.log('loaing', loading);

  return loading === true ? (
    <AntLoader />
  ) : loading === false ? (
    <>
      <Row justify='space-around' align='middle'>
        <Col
          span={12}
          style={
            ({ margin: '0 auto' }, { padding: '55px' }, { maxWidth: '300px' })
          }>
          <Carousel autoplay>
            {product.images.map((item) => (
              <div>
                <h3 style={contentStyle}>
                  <img src={item.url} preview={{ visible: false }} />
                </h3>
              </div>
            ))}
          </Carousel>

          {/* <Image
            width={400}
            // src={{ ...product.images }[0].url}
            preview={{ visible: false }}
          /> */}
        </Col>
        <Col span={12} style={({ margin: '0 auto' }, { padding: '35px' })}>
          <Title level={3}>{product.name}</Title>
          <Title level={4}>
            <NumberFormat
              style={{ color: '#0050b3' }}
              value={product.price}
              displayType={'text'}
              thousandSeparator={true}
              suffix={'đ'}
            />
          </Title>
          <Rate
            allowHalf
            disabled
            defaultValue={product.rate === 0 ? 4.5 : product.rate}
          />

          {product.quantity !== 0 ? (
            <>
              <Row style={{ marginTop: '16px' }}>
                <InputNumber
                  min={1}
                  max={product.quantity}
                  defaultValue={1}
                  onChange={onChange}
                />
              </Row>
              <Row>
                <Col style={{ marginTop: '16px' }}>
                  <Button type='primary' onClick={addToCartHandler}>
                    Add to cart
                  </Button>
                </Col>
                <Col style={{ margin: '16px' }}></Col>
              </Row>
            </>
          ) : (
            <>
              <Row>
                <Col style={{ marginTop: '16px' }}>
                  <Tag color='#f50'>Out of stock</Tag>
                </Col>
                <Col style={{ margin: '16px' }}></Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
      <Space style={{ margin: '32px' }}>
        <Typography>
          <Title style={{ fontSize: '20px' }}>Mô tả</Title>
          <Paragraph>{product.description}</Paragraph>
        </Typography>
      </Space>

      <Space style={{ margin: '0 32px' }} direction='vertical'>
        <Descriptions title='Đánh giá'></Descriptions>

        {product.rating.map((item) => (
          <Descriptions title=''>
            <Descriptions.Item label='UserName' span={3}>
              {item.userName}
            </Descriptions.Item>
            <Descriptions.Item label='Rate' span={3}>
              <Rate allowHalf disabled defaultValue={item.rating} />
            </Descriptions.Item>
            <Descriptions.Item label='Comment' span={3}>
              {item.comment}
            </Descriptions.Item>
            <Descriptions title=''></Descriptions>
          </Descriptions>
        ))}
      </Space>
    </>
  ) : (
    <AntError />
  );
};

export default AntProductDetail;
