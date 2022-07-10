import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserDetailList } from '../actions/userActions.js';

import { updateUserDetail, createUserDetail } from '../actions/userActions';
import { USER_DETAIL_UPDATE_RESET } from '../constants/userConstants';
import { USER_DETAIL_CREATE_RESET } from '../constants/userConstants';

import {
  Button,
  Input,
  Collapse,
  message,
  Descriptions,
  Layout,
  Modal,
  Form,
  Tag,
} from 'antd';

const { Panel } = Collapse;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

///////////////
const UserInfo = ({ match, location, history }) => {
  const [value, setValue] = useState();
  const [checkedAddress, setCheckedAddress] = useState();
  const userLogin = useSelector((state) => state.userLogin);
  const { loadingUser, error, userInfo } = userLogin;
  const [visible, setVisible] = useState(false);

  const [edited, setEdited] = useState({});

  const userDetailUpdate = useSelector((state) => state.userDetailUpdate);
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
    userDetail: ressult,
  } = userDetailUpdate;

  const userDetailCreate = useSelector((state) => state.userDetailCreate);
  const {
    loading: loadingCreate,
    success: successCreate,
    error: errorCreate,
    userDetail: ressultCreate,
  } = userDetailCreate;

  useEffect(() => {
    if (successUpdate === true) {
      message.success('Edit user detail id: ' + ressult.id);

      dispatch({ type: USER_DETAIL_UPDATE_RESET });
    } else if (successUpdate === false) {
      message.warning('This is a warning message: ' + errorUpdate);
    }
    dispatch(getUserDetailList());
  }, [successUpdate]);

  useEffect(() => {
    if (successCreate === true) {
      message.success('Create user detai ');

      dispatch({ type: USER_DETAIL_CREATE_RESET });
    } else if (successCreate === false) {
      message.warning('This is a warning message: ' + errorCreate);
    }
    dispatch(getUserDetailList());
  }, [successCreate]);

  const onCreate = (values) => {
    if (typeof edited === 'undefined') {
      console.log('Create: ', values);

      values.userDetail.status = 'UNDEFAULT';
      console.log(values);
      dispatch(createUserDetail(values.userDetail));
    } else {
      console.log('Upda: ', values);
      values.userDetail.id = edited.id;
      values.userDetail.status = edited.status;
      console.log('Received values of form: ', values);
      console.log('Received values of form: ', values.userDetail);
      dispatch(updateUserDetail(values.userDetail.id, values.userDetail, ''));
    }

    setVisible(false);
  };

  const handClicked = (item) => {
    console.log(' checked', item);
    setEdited(item);
    setVisible(true);
  };

  const handClickedChangeStatus = (item) => {
    dispatch(updateUserDetail(item.id, null, 'DEFAULT'));
  };
  const handClickedDelete = (item) => {
    dispatch(updateUserDetail(item.id, null, 'DELETED'));
  };

  const dispatch = useDispatch();
  const listUserDetail = useSelector((state) => state.userDetailList);
  const { loading, error: errorDetail, details } = listUserDetail;

  console.log(details);
  useEffect(() => {
    dispatch(getUserDetailList());
  }, [dispatch]);

  ////////////////

  const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
      <Modal
        visible={visible}
        title='User detail'
        okText='Ok'
        cancelText='Cancel'
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}>
        <Form
          form={form}
          layout='vertical'
          name='form_in_modal'
          fields={[
            {
              name: ['userDetail', 'firstName'],
              value: typeof edited === 'undefined' ? '' : edited.firstName,
            },
            {
              name: ['userDetail', 'lastName'],
              value: typeof edited === 'undefined' ? '' : edited.lastName,
            },
            {
              name: ['userDetail', 'phone'],
              value: typeof edited === 'undefined' ? '' : edited.phone,
            },
            {
              name: ['userDetail', 'address'],
              value: typeof edited === 'undefined' ? '' : edited.address,
            },
          ]}>
          <Form.Item
            name={['userDetail', 'firstName']}
            label='First Name'
            rules={[
              {
                required: true,
                message: 'Please input the first name!',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={['userDetail', 'lastName']}
            label='Last Name'
            rules={[
              {
                required: true,
                message: 'Please input the last name!',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={['userDetail', 'phone']}
            label='Phone'
            rules={[
              {
                required: true,
                message: 'Please input the phone!',
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            name={['userDetail', 'address']}
            label='Address'
            rules={[
              {
                required: true,
                message: 'Please input the address!',
              },
            ]}>
            <Input type='textarea' />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    !loading && (
      <Layout style={({ margin: '0 auto' }, { padding: '55px' })}>
        <Descriptions
          title='User Info'
          bordered
          column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
          <Descriptions.Item label='Phone'>{userInfo.phone}</Descriptions.Item>
          <Descriptions.Item label='Email'>{userInfo.email}</Descriptions.Item>
          <Descriptions.Item label='Roles'>
            {userInfo.roles.map((item) => (
              <>{item}</>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label='User Info Detail'>
            <Button
              type='primary'
              style={{ width: '100px' }}
              onClick={() => {
                handClicked();
              }}>
              Add
            </Button>
          </Descriptions.Item>
        </Descriptions>
        <br />

        <Descriptions title='' layout='horizontal'></Descriptions>

        {details.map((item) => (
          <Descriptions
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            {item.status !== 'DELETED' ? (
              <>
                <Descriptions.Item label='First name' span={3}>
                  {item.firstName}
                </Descriptions.Item>
                <Descriptions.Item label='Last name' span={3}>
                  {item.lastName}
                </Descriptions.Item>
                <Descriptions.Item label='Phone' span={3}>
                  {item.phone}
                </Descriptions.Item>
                <Descriptions.Item label='Address' span={3}>
                  {item.address}
                </Descriptions.Item>
                <Descriptions.Item label='Status' span={3}>
                  <Tag color={item.status === 'DEFAULT' ? '#2db7f5' : 'green'}>
                    {item.status !== 'DEFAULT' ? (
                      <Button
                        type='link'
                        onClick={() => {
                          handClickedChangeStatus(item);
                        }}>
                        Change
                      </Button>
                    ) : (
                      <Button disabled type='link'>
                        |
                      </Button>
                    )}

                    {item.status}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label='' span={3}>
                  <Button
                    type='link'
                    onClick={() => {
                      handClicked(item);
                    }}>
                    Edit
                  </Button>

                  {item.status !== 'DEFAULT' ? (
                    <Button
                      danger
                      type='link'
                      onClick={() => {
                        handClickedDelete(item);
                      }}>
                      Delete
                    </Button>
                  ) : (
                    <></>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='' span={3}></Descriptions.Item>
              </>
            ) : (
              <></>
            )}
          </Descriptions>
        ))}

        <CollectionCreateForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </Layout>
    )
  );
};

export default UserInfo;
