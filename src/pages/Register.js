import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { signupUser } from '../actions/userActions';
import { USER_REGISTER_RESET } from '../constants/userConstants';

import {
  Button,
  Layout,
  Menu,
  Breadcrumb,
  Form,
  Input,
  InputNumber,
  Upload,
  Select,
  message,
  Progress,
  Modal,
  Checkbox,
  Row,
  Col,
  Radio,
} from 'antd';
import 'antd/dist/antd.css';

const { Content } = Layout;
const { Option } = Select;

const Register = ({ history, match }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userLogin);

  const userCreate = useSelector((state) => state.userCreate);
  const {
    loading: loadingCreateUser,
    success: successCreateUser,
    error: errorCreateUser,
    user: ressultUser,
  } = userCreate;

  const { userInfo } = user;

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  const onFinish = (values) => {
    console.log(values);
    dispatch(signupUser(values.user));
  };

  useEffect(() => {
    if (successCreateUser === true) {
      message.success('Added user name: ' + ressultUser.phone);
      dispatch({ type: USER_REGISTER_RESET });
      history.push('/login');
    } else if (successCreateUser === false) {
      message.warning('This is a warning message: ' + errorCreateUser);
    }
  }, [successCreateUser]);

  return (
    <Content style={{ margin: '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>User</Breadcrumb.Item>
        <Breadcrumb.Item>Register</Breadcrumb.Item>
      </Breadcrumb>

      <Form
        {...layout}
        name='nest-messages'
        onFinish={onFinish}
        validateMessages={validateMessages}
        wrapperCol={{ sm: 24 }}
        style={{ width: '80%', marginRight: 0 }}
        initialValues={{
          'checkbox-group': ['USER', 'ADMIN'],
        }}>
        <Form.Item
          name={['user', 'firstName']}
          label='First name'
          rules={[
            {
              required: true,
              message: 'Please input your First name!',
            },
            { min: 1, message: 'First name must be minimum 1 characters.' },
            { max: 40, message: 'First name must be maximum 40 characters.' },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          name={['user', 'lastName']}
          label='Last name'
          rules={[
            {
              required: true,
              message: 'Please input your Last name!',
            },
            { min: 1, message: 'Last name must be minimum 1 characters.' },
            { max: 40, message: 'Last name must be maximum 40 characters.' },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          name={['user', 'phone']}
          label='Phone'
          rules={[
            { required: true },
            { min: 10, message: 'Phone must be minimum 10 characters.' },
            { max: 11, message: 'Phone must be maximum 11 characters.' },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          name={['user', 'email']}
          label='E-mail'
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
            { max: 50, message: 'E-mail must be maximum 50 characters.' },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          name={['user', 'address']}
          label='Address'
          rules={[
            {
              required: true,
              message: 'Please input your Address!',
            },
            { min: 6, message: 'Phone must be minimum 6 characters.' },
            { max: 40, message: 'Phone must be maximum 40 characters.' },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          name={['user', 'password']}
          label='Password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            { min: 6, message: 'Password must be minimum 6 characters.' },
            { max: 40, message: 'Password must be maximum 40 characters.' },
          ]}
          hasFeedback>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name={['user', 'confirm']}
          label='Confirm Password'
          dependencies={['user', 'password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            { min: 5, message: 'Username must be minimum 5 characters.' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue(['user', 'password']) === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 12,
          }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default Register;
