import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { createUser } from '../actions/userActions';
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

const AntAdminUserAdd = ({ history, match }) => {
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
    dispatch(createUser(values.user));
  };

  useEffect(() => {
    if (successCreateUser === true) {
      message.success('Added user name: ' + ressultUser.phone);
      dispatch({ type: USER_REGISTER_RESET });
      history.push('/admin/users');
    } else if (successCreateUser === false) {
      message.warning('This is a warning message: ' + errorCreateUser);
    }
  }, [successCreateUser]);

  return (
    <Content style={{ margin: '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>User</Breadcrumb.Item>
        <Breadcrumb.Item>Add</Breadcrumb.Item>
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
          name={['user', 'phone']}
          label='Phone'
          rules={[{ required: true }]}>
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
          name={['user', 'role']}
          label='Roles'
          rules={[
            {
              required: true,
              message: 'Please input your Roles!',
            },
          ]}>
          <Checkbox.Group>
            <Row>
              <Col span={12}>
                <Checkbox
                  value='ROLE_USER'
                  style={{
                    lineHeight: '32px',
                  }}>
                  User
                </Checkbox>
              </Col>

              <Col span={12}>
                <Checkbox
                  value='ROLE_ADMIN'
                  style={{
                    lineHeight: '32px',
                  }}>
                  Admin
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
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

export default AntAdminUserAdd;
