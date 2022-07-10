import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import AntError from '../components/AntError.js';
import AntLoader from '../components/AntLoading.js';
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions.js';
import NumberFormat from 'react-number-format';
import { PRODUCT_DELETE_RESET } from '../constants/productConstants';
import {
  Image,
  Table,
  Tag,
  Button,
  Space,
  Layout,
  Menu,
  Breadcrumb,
  Popconfirm,
  Pagination,
  message,
  Row,
  Col,
  Divider,
  Modal,
} from 'antd';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { confirm } = Modal;
const AntdAdminListProducts = ({ history, match }) => {
  const keyword = match.params.keyword;
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = productDelete;

  // const productCreate = useSelector(state => state.productCreate)
  // const { loading: loadingCreate, success: successCreate, error: errorCreate, product: createdProduct } = productCreate

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const key = 'updatable';
  useEffect(() => {
    dispatch({ type: PRODUCT_DELETE_RESET });

    if (successDelete === true) {
      message.success('Deleted product');
      // dispatch(listProducts(keyword, pageSize, current - 1));
    } else if (successDelete === false) {
      message.warning('This is a warning message: ' + errorDelete);
    }

    dispatch(listProducts(keyword, pageSize, current - 1));
    // message.success({ content: 'Loaded!', key, duration: 2 });
  }, [dispatch, successDelete, pageSize, current]);

  console.log(products);

  const handleDelete = (id) => {
    console.log('oke delet' + id);
    dispatch(deleteProduct(id));
    // setPreviewVisible(false);
  };

  ///
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [progress, setProgress] = useState(0);

  const onPreview = async (url) => {
    console.log('ádasd', url.url);
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }

    // setPreviewImage(url);
    // setPreviewVisible(true);
    // setPreviewTitle(url.substring(url.lastIndexOf('/') + 1));
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      render: (images) => (
        <div style={{ display: 'inline' }}>
          <Image
            width={100}
            alt={{ ...images[0] }.url}
            src={{ ...images[0] }.url}
            preview={false}
            onClick={() => onPreview({ ...images[0] })}
          />
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => (
        <div>
          <NumberFormat
            value={record.price}
            displayType={'text'}
            thousandSeparator={true}
            suffix={'đ'}
          />
        </div>
      ),

      // className: 'column-money',
      // dataIndex: 'money',
      // align: 'right',
    },

    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '9%',
      // className: 'column-money',
      // dataIndex: 'money',
      // align: 'right',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status) => {
        let color = status.length > 5 ? 'geekblue' : 'green';
        if (status === 'UNAVAILABLE') {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      width: '10%',
      render: (_, record) =>
        products.data.length >= 1 ? (
          <Popconfirm
            title='Sure to delete?'
            onConfirm={() => handleDelete(record.foodId)}>
            <a>
              <Tag color='error'>Delete</Tag>
            </a>
          </Popconfirm>
        ) : null,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      width: '10%',
      render: (_, record) =>
        products.data.length >= 1 ? (
          <Link to={`/admin/products/${record.foodId}/edit`}>
            <Tag color='green'>Edit</Tag>
          </Link>
        ) : null,
    },
  ];

  function onPageChange(current, pageSize) {
    console.log(current, pageSize);
    setCurrent(current);
    setPageSize(pageSize);
  }
  const MyPagination = ({ total, onChange, current }) => {
    return (
      <Pagination
        // responsive
        onChange={onChange}
        total={total}
        current={current}
        pageSize={pageSize}
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
      />
    );
  };

  function onShowSizeChange(current, pageSize) {
    // console.log(current, pageSize);
    // setPageSize(pageSize);
  }

  return loading ? (
    <AntLoader />
  ) : error ? (
    <AntError />
  ) : (
    <Layout className='site-layout'>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
          <Breadcrumb.Item>Product</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          <Col span={12}>
            <MyPagination
              total={products.totalItems}
              current={current}
              onChange={onPageChange}
            />
          </Col>

          <Col span={12}>
            <Divider orientation='right'>
              <Link to='/admin/products/add'>
                <Button type='primary'>Add Product</Button>
              </Link>
            </Divider>
          </Col>
        </Row>

        <Table
          columns={columns}
          rowKey='foodId'
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{record.description}</p>
            ),
            rowExpandable: (record) => record.description !== '',
          }}
          scroll={{ x: '', y: 400 }}
          dataSource={products.data}
          pagination={false}
        />

        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}>
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Content>
    </Layout>
  );
};

export default AntdAdminListProducts;
