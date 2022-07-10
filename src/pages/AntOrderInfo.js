import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { getMyListOrder } from '../actions/orderActions.js';
import NumberFormat from 'react-number-format';
import { getFullDate } from '../helper/getFullDate.js';
import { RATING_CREATE_RESET } from '../constants/ratingConstants';
import { createRating } from '../actions/ratingActions';
import {
  Image,
  Table,
  Tag,
  Layout,
  Menu,
  Breadcrumb,
  Pagination,
  Row,
  Col,
  Timeline,
  Button,
  Form,
  Input,
  Modal,
  Rate,
  message,
} from 'antd';
import 'antd/dist/antd.css';

const { Content } = Layout;
const { SubMenu } = Menu;

const AntOrderInfo = () => {
  const dispatch = useDispatch();
  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading, error, orders } = orderMyList;
  const [id, setId] = useState();
  const [visible, setVisible] = useState(false);

  const [editedRate, setEditedrate] = useState({});
  const [editedProduct, setEditedProduct] = useState({});

  const ratingCreate = useSelector((state) => state.ratingCreate);
  const {
    loading: loadingCreate,
    success: successCreate,
    error: errorCreate,
    userDetail: ressultCreate,
  } = ratingCreate;

  useEffect(() => {
    if (successCreate === true) {
      message.success('Create user rating ');

      dispatch({ type: RATING_CREATE_RESET });
    } else if (successCreate === false) {
      message.warning('This is a warning message: ' + errorCreate);
    }
  }, [successCreate]);

  useEffect(() => {
    dispatch(getMyListOrder());
  }, [dispatch]);

  console.log(orders);

  const handClicked = (item) => {
    // console.log(' checked', product);
    // setEditedProduct(product);
    setEditedrate(item);
    setVisible(true);
  };

  const [current, setCurrent] = useState(1);

  const key = 'updatable';

  const onCreate = (values) => {
    values.rate.foodId = editedRate.id;
    console.log('Received values of form: ', values);
    dispatch(createRating(values.rate));

    // if (typeof values.userDetail.id === 'undefined') {
    //   values.userDetail.status = 'UNDEFAULT';
    //   console.log(values);
    //   dispatch(createUserDetail(values.userDetail));
    // } else {
    //   values.userDetail.id = edited.id;
    //   values.userDetail.status = edited.status;
    //   console.log('Received values of form: ', values);
    //   console.log('Received values of form: ', values.userDetail);
    //   dispatch(updateUserDetail(values.userDetail.id, values.userDetail));
    // }

    setVisible(false);
  };

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
              name: ['rate', 'comment'],
              value: '',
            },
            {
              name: ['rate', 'rating'],
              value: 5,
            },
          ]}>
          <Form.Item
            name={['rate', 'rating']}
            label='Rate'
            rules={[
              {
                required: true,
                message: 'Please input the phone!',
              },
            ]}>
            <Rate />
          </Form.Item>

          <Form.Item
            name={['rate', 'comment']}
            label='Comment'
            rules={[
              {
                required: true,
                message: 'Please input the phone!',
              },
            ]}>
            <Input type='textarea' />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const expandedRow = (row) => {
    const columns = [
      {
        title: 'Image',
        dataIndex: 'image',
        width: '10%',
        render: (image) => (
          <Image width={150} alt={image} src={image} preview={{}} />
        ),
      },
      { title: 'Name', dataIndex: 'name', key: 'nameFood', width: '40%' },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amountFood',
        width: '10%',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'priceFood',
        width: '30%',
        render: (priceFood) => (
          <NumberFormat
            value={priceFood}
            displayType={'text'}
            thousandSeparator={true}
            suffix={'đ'}
          />
        ),
      },
      {
        title: '',
        dataIndex: 'status',
        key: 'x',
        render: (_, record) =>
          row.status === 'DELIVERIED' ? (
            <div>
              <Button
                type='primary'
                onClick={() => {
                  handClicked(record);
                }}>
                Rating
              </Button>
            </div>
          ) : null,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={row.orderFoods}
        rowKey='id'
        pagination={false}
      />
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: '8%',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Phone',
      dataIndex: ['userDetailDto', 'phone'],
      key: 'phone',
      width: '10%',
      // render: (text) => <a>{text}</a>,
    },

    {
      title: 'Name',
      dataIndex: ['userDetailDto', 'firstName'],
      key: 'name',
      width: '15%',
      // render: (text) => <a>{text}</a>,
    },

    {
      title: 'Address',
      dataIndex: ['userDetailDto', 'address'],
      key: 'address',
      width: '20%',
      // render: (text) => <a>{text}</a>,
    },

    {
      title: 'Total',
      dataIndex: '',
      key: 'total',
      render: (_, record) =>
        orders.length >= 1 ? (
          <div>
            <NumberFormat
              value={record.orderFoods.reduce(
                (acc, item) => acc + item.amount * item.price,
                0
              )}
              displayType={'text'}
              thousandSeparator={true}
              suffix={'đ'}
            />
          </div>
        ) : //   <Popconfirm
        //     title='Sure to delete?'

        //     // onConfirm={() => this.handleDelete(record.key)}
        //   >
        //     <a>Delete</a>
        //   </Popconfirm>
        null,
    },

    {
      title: 'Date',
      dataIndex: '',
      key: 'createdDate',
      render: (_, record) =>
        orders.length >= 1 ? (
          <div>
            <Timeline>
              <Timeline.Item>{getFullDate(record.createdDate)}</Timeline.Item>
              <Timeline.Item>{getFullDate(record.updatedDate)}</Timeline.Item>
            </Timeline>
          </div>
        ) : null,
      // render: (createdDate) => getFullDate(createdDate),
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status.length > 5 ? 'geekblue' : 'green';
        if (status === 'CANCELLED') {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  const pageSize = 10;
  const getData = (current, pageSize) => {
    // Normally you should get the data from the server
    return orders.slice((current - 1) * pageSize, current * pageSize);
  };
  // Custom pagination component
  const MyPagination = ({ total, onChange, current }) => {
    return (
      <Pagination
        onChange={onChange}
        total={total}
        current={current}
        pageSize={pageSize}
      />
    );
  };

  return (
    !loading && (
      <Layout className='site-layout'>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>My Order</Breadcrumb.Item>
          </Breadcrumb>

          <Row>
            <Col span={12}>
              <MyPagination
                total={orders.length}
                current={current}
                onChange={setCurrent}
              />
            </Col>

            <Col span={12}></Col>
          </Row>

          <Table
            columns={columns}
            rowKey='orderId'
            // expandable={{
            //   expandedRowRender: (record) => (
            //     <p style={{ margin: 0 }}>{record.description}</p>
            //   ),
            //   rowExpandable: (record) => record.description !== '',
            // }}
            dataSource={getData(current, pageSize)}
            pagination={false}
            expandedRowRender={expandedRow}
            scroll={{ x: '', y: 400 }}
          />

          <CollectionCreateForm
            visible={visible}
            onCreate={onCreate}
            onCancel={() => {
              setVisible(false);
            }}
          />
        </Content>
      </Layout>
    )
  );
};

export default AntOrderInfo;
