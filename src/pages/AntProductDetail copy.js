import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../actions/productActions.js';
import NumberFormat from 'react-number-format';
import AntLoader from '../components/AntLoading';
import { addToCart } from '../actions/cartActions';
import AntError from '../components/AntError';
import {
  Row,
  Col,
  Typography,
  Form,
  Button,
  Input,
  Rate,
  InputNumber,
  Space,
  message,
  Carousel,
} from 'antd';
import { CART_ADD_ITEM_RESET } from '../constants/cartConstants';
const { Title, Paragraph, Text, Link: LinkTy } = Typography;
const { TextArea } = Input;

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

  const [comment, setComment] = useState({
    comments: [],
    submitting: false,
    value: '',
  });

  const addToCartHandler = () => {
    dispatch(addToCart(match.params.id, qty));
    // history.push(`/cartt/${match.params.id}?qty=${qty}`);
  };

  // useEffect(() => {
  //   if (success) {
  //     message.success('Added to cart');
  //     dispatch({ type: CART_ADD_ITEM_RESET });
  //   } else if (success === false) {
  //     message.warning(errorCreate);
  //     dispatch({ type: CART_ADD_ITEM_RESET });
  //   }

  //   dispatch(getProductDetails(match.params.id));
  // }, [dispatch, productId, success]);

  //////////////////

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
  ) : (
    <>
      <Row justify='space-around' align='middle'>
        <Col span={12} style={({ margin: '0 auto' }, { padding: '55px' })}>
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
              prefix={'$ '}
            />
          </Title>
          <Rate
            allowHalf
            disabled
            defaultValue={product.rate === 0 ? 4.5 : product.rate}
          />
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
        </Col>
      </Row>
      <Space style={{ margin: '32px' }}>
        <Typography>
          <Title style={{ fontSize: '20px' }}>Description</Title>
          <Paragraph>
            In the process of internal desktop applications development, many
            different design specs and implementations would be involved, which
            might cause designers and developers difficulties and duplication
            and reduce the efficiency of development.
          </Paragraph>
        </Typography>
      </Space>
    </>
  );
};

export default AntProductDetail;
