import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../actions/userActions.js';
import {
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Carousel,
  message,
} from 'antd';

const { Title, Link: AntLink } = Typography;

const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const Login = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (error) {
      message.warning(error);
    } else {
      if (userInfo) {
        message.success('Login success');
        console.log('aaaaaaaaaa ' + userInfo.message);
        history.push(redirect);
      }
    }
  }, [history, userInfo, redirect, error]);

  const onFinish = (values) => {
    // e.preventDefault();
    dispatch(login(values.phone, values.password));
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ padding: '50px 70px' }}>
      <Row>
        <Col span={10}>
          <Form
            name='normal_login'
            className='login-form'
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            style={{ padding: '0 100px' }}>
            <Title
              level={5}
              style={{ justifyContent: 'center', display: 'flex' }}>
              Login
            </Title>
            <Form.Item
              name='phone'
              rules={[
                {
                  required: true,
                  message: 'Please input your Phone!',
                },
              ]}>
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                type='number'
                placeholder='Phone'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}>
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='Password'
              />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Space align='baseline'>
                <Button type='primary' htmlType='submit'>
                  Log in
                </Button>
              </Space>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Space align='baseline'>
                <AntLink href='/register'>Sign up</AntLink>
              </Space>
            </Form.Item>
          </Form>
        </Col>
        <Col span={14}>
          <Carousel autoplay>
            <div>
              <h3 style={contentStyle}>1</h3>
            </div>
            <div>
              <h3 style={contentStyle}>2</h3>
            </div>
            <div>
              <h3 style={contentStyle}>3</h3>
            </div>
            <div>
              <h3 style={contentStyle}>4</h3>
            </div>
          </Carousel>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
