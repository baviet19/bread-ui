import React from 'react';
import { Card, Col, Divider, Badge, Button, Row, Rate } from 'antd';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import '../App.css';
const { Meta } = Card;

const AntProduct = ({
  images,
  name,
  foodId,
  description,
  categoryId,
  rate,
  status,
  quantity,
  price,
}) => {
  return (
    <div className='product-card'>
      <Link to={`/products/${foodId}`}>
        {/* <Col span={8}> */}
          {/* <Badge.Ribbon
            text={quantity !== 0 ? 'Hot' : 'Out of stock'}
            color={quantity !== 0 ? 'cyan' : '#f50'}> */}
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <img alt='example' src={{ ...images[0] }.url} alt={name} />
              }>
              <Meta title={name} />
              <Meta
                title={
                  <NumberFormat
                    style={{ color: '#0050b3' }}
                    value={price}
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix={' đ'}
                  />
                }
              />
              <Divider>
                <Rate
                  allowHalf
                  disabled
                  defaultValue={rate === 0 ? 4.5 : rate}
                />
              </Divider>
            </Card>
          {/* </Badge.Ribbon> */}
        {/* </Col> */}
      </Link>
    </div>
  );
};

export default AntProduct;
