import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { getListOrder } from '../actions/orderActions.js';
import NumberFormat from 'react-number-format';
import { getFullDate } from '../helper/getFullDate.js';
import { updateOrder } from '../actions/orderActions';
import { ORDER_UPDATE_RESET } from '../constants/orderConstants';
import AntError from '../components/AntError.js';
import AntLoader from '../components/AntLoading.js';
import {
  Image,
  Table,
  Tag,
  Button,
  Layout,
  Menu,
  Breadcrumb,
  Popconfirm,
  Pagination,
  message,
  Row,
  Col,
  Divider,
  Timeline,
  Dropdown,
  Slider,
  Select,
  Radio,
} from 'antd';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';
const { Content } = Layout;
const { SubMenu } = Menu;

const marks = {
  0: '',
  50: '',

  100: {
    style: {
      color: '#f50',
    },
    label: <strong></strong>,
  },
};

const AntAdminListOrders = () => {
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const [id, setId] = useState();
  const orderUpdate = useSelector((state) => state.orderUpdate);
  const {
    loading: loadingUpdateOrder,
    success: successUpdateOrder,
    error: errorUpdateOrder,
    order: ressultOrder,
  } = orderUpdate;

  console.log(orders);

  const [current, setCurrent] = useState(1);

  const key = 'updatable';

  useEffect(() => {
    if (successUpdateOrder === true) {
      message.success('Updates order id: ' + ressultOrder.orderId);
      // console.log('ok' + ressultOrder.orderId);
      dispatch({ type: ORDER_UPDATE_RESET });
    } else if (successUpdateOrder === false) {
      message.warning('This is a warning message: ' + errorUpdateOrder);
    }
    dispatch(getListOrder());
    // message.success({ content: 'Loaded!', key, duration: 2 });
  }, [successUpdateOrder]);

  function handleButtonClick(e) {
    // message.info('Click on left button.');
    // console.log('click left button');
  }

  function handleMenuClick(id, st) {
    // message.info('Click on menu item.' + id + ' ' + status);
  }

  function confirm(id, st) {
    console.log({ status: st });
    dispatch(updateOrder(id, { status: st }));
  }

  const menu = (id, status) => (
    <Menu onClick={() => handleMenuClick(id, status)}>
      <Menu.Item key='ORDERED'>
        <Popconfirm
          title='Are you sure？'
          okText='Yes'
          cancelText='No'
          onConfirm={() => confirm(id, 'ORDERED')}
          disabled={status === 'ORDERED'}>
          <Tag color='#108ee9'>ORDERED</Tag>
        </Popconfirm>
      </Menu.Item>

      <Menu.Item key='DELIVERIED'>
        <Popconfirm
          title='Are you sure？'
          okText='Yes'
          cancelText='No'
          onConfirm={() => confirm(id, 'DELIVERIED')}
          disabled={status === 'DELIVERIED'}>
          <Tag color='#87d068'>DELIVERIED</Tag>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item key='CANCELLED'>
        <Popconfirm
          title='Are you sure？'
          okText='Yes'
          cancelText='No'
          disabled={status === 'CANCELLED'}
          onConfirm={() => confirm(id, 'CANCELLED')}>
          <Tag color='#f50'>CANCELLED</Tag>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const expandedRow = (row) => {
    console.log(row.orderFoods);

    const columns = [
      {
        title: 'Image',
        dataIndex: 'image',
        width: '20%',
        render: (image) => (
          <Image width={150} alt={image} src={image} preview={{}} />
        ),
      },
      { title: 'Name', dataIndex: 'name', key: 'nameFood', width: '40%' },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amountFood',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'priceFood',
        width: '30%',
        render: (_, record) =>
          orders.length >= 1 ? (
            <div>
              <NumberFormat
                value={record.price}
                displayType={'text'}
                thousandSeparator={true}
                suffix={'đ'}
              />
            </div>
          ) : null,
      },
      //   {
      //     title: 'Action',
      //     dataIndex: 'operation',
      //     key: 'operation',
      //     render: () => (
      //       <Space size='middle'>
      //         <a>Pause</a>
      //         <a>Stop</a>
      //         <Dropdown overlay={menu}>
      //           <a>
      //             More <DownOutlined />
      //           </a>
      //         </Dropdown>
      //       </Space>
      //     ),
      //   },
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
      width: '10%',
      // render: (text) => <a>{text}</a>,
    },

    {
      title: 'Phone',
      dataIndex: ['userDetailDto', 'phone'],
      key: 'phone',
      // render: (text) => <a>{text}</a>,
    },

    // {
    //   title: 'Name',
    //   dataIndex: ['userDetailDto', 'firstName'],
    //   key: 'name',
    //   // render: (text) => <a>{text}</a>,
    // },

    // {
    //   title: 'Address',
    //   dataIndex: ['userDetailDto', 'address'],
    //   key: 'address',
    //   // render: (text) => <a>{text}</a>,
    // },

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
    // {
    //   title: 'Updated Date',
    //   dataIndex: 'updatedDate',
    //   key: 'updatedDate',
    //   render: (updatedDate) => getFullDate(updatedDate),
    // },

    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (status) => {
    //     let color = status.length > 5 ? 'geekblue' : 'green';
    //     if (status === 'CANCELLED') {
    //       color = 'volcano';
    //     }
    //     return (
    //       <Tag color={color} key={status}>
    //         {status.toUpperCase()}
    //       </Tag>
    //     );
    //   },
    // },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'x',
      render: (_, record) =>
        orders.length >= 1 ? (
          <div>
            <Dropdown
              overlay={() => menu(record.orderId, record.status)}
              onClick={handleButtonClick}
              trigger={['click']}>
              <Button>{record.status}</Button>
            </Dropdown>
          </div>
        ) : null,
    },
  ];

  const [pageSize, setPageSize] = useState(5);
  const getData = (current, pageSize) => {
    // Normally you should get the data from the server
    return orders.slice((current - 1) * pageSize, current * pageSize);
  };
  // Custom pagination component
  const MyPagination = ({ total, onChange, current, pageNumber }) => {
    console.log(pageNumber);
    return (
      <Pagination
        onChange={onChange}
        total={total}
        current={current}
        pageSize={pageSize}
      />
    );
  };

  return loading ? (
    <AntLoader />
  ) : error ? (
    <AntError />
  ) : (
    <Layout className='site-layout'>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
          <Breadcrumb.Item>Order</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          {/* <Col span={12}>
              <MyPagination
                total={orders.length}
                current={current}
                onChange={setCurrent}
              />
            </Col> */}

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

          // dataSource={getData(current, pageSize)}
          // pagination={false}
          dataSource={orders}
          pagination={{
            pageSizeOptions: ['10', '20', '30'],
            showSizeChanger: true,
            locale: { items_per_page: '' },
          }}
          expandedRowRender={expandedRow}
          scroll={{ x: '', y: 400 }}
        />
      </Content>
    </Layout>
  );
};

export default AntAdminListOrders;
