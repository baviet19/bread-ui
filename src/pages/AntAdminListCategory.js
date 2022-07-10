import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { listCategories, deleteCategory } from '../actions/categoryActions.js';
import { CATEGORY_DELETE_RESET } from '../constants/categoryConstants';

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
  Modal,
} from 'antd';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';
const { Content } = Layout;
const { SubMenu } = Menu;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const AntAdminListCategory = () => {
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingListCategory,
    error: errorCategories,
    categories,
  } = categoryList;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = categoryDelete;

  // const [visible, setVisible] = useState(false);
  // const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: CATEGORY_DELETE_RESET });
    if (successDelete === true) {
      message.success('Deleted category');

      dispatch(listCategories());
    } else if (successDelete === false) {
      message.warning('This is a warning message: ' + errorDelete);
    }

    dispatch(listCategories());
    // message.success({ content: 'Loaded!', key, duration: 2 });
  }, [dispatch, successDelete]);

  const handleDelete = (id) => {
    // console.log('oke delet' + id);
    dispatch(deleteCategory(id));
    // setPreviewVisible(false);
  };

  ///
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [progress, setProgress] = useState(0);

  const onPreview = async (url) => {
    console.log('ádasd', url);
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }

    setPreviewImage(url);
    setPreviewVisible(true);
    setPreviewTitle(url.substring(url.lastIndexOf('/') + 1));
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  console.log(categories);

  const [current, setCurrent] = useState(1);

  const key = 'updatable';

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image) => (
        <Image
          width={100}
          alt={image}
          src={image}
          preview={false}
          onClick={() => onPreview(image)}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (text) => <a>{text}</a>,
    },

    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      width: '10%',
      render: (_, record) =>
        categories.length >= 1 ? (
          <Popconfirm
            title='Sure to delete?'
            onConfirm={() => handleDelete(record.categoryId)}>
            {/* <a>Delete</a> */}
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
        categories.length >= 1 ? (
          <Link to={`/admin/category/${record.categoryId}/edit`}>
            <Tag color='green'>Edit</Tag>
          </Link>
        ) : null,
    },
  ];

  const pageSize = 4;
  const getData = (current, pageSize) => {
    // Normally you should get the data from the server
    return categories.slice((current - 1) * pageSize, current * pageSize);
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

  return loadingListCategory ? (
    <AntLoader />
  ) : errorCategories ? (
    <AntError />
  ) : (
    <Layout className='site-layout'>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
          <Breadcrumb.Item>Category</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          <Col span={12}>
            {/* <MyPagination
                total={categories.length}
                current={current}
                onChange={setCurrent}
              /> */}
          </Col>

          <Col span={12}>
            <Divider orientation='right'>
              <Link to='/admin/category/add'>
                <Button type='primary'>Add Category</Button>
              </Link>
            </Divider>
          </Col>
        </Row>

        <Table
          columns={columns}
          rowKey='categoryId'
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{record.description}</p>
            ),
            rowExpandable: (record) => record.description !== '',
          }}
          // dataSource={getData(current, pageSize)}
          // pagination={false}
          dataSource={categories}
          pagination={{
            pageSizeOptions: ['10', '20', '30'],
            showSizeChanger: true,
            locale: { items_per_page: '' },
          }}
          scroll={{ x: '', y: 400 }}
        />
      </Content>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}>
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Layout>
  );
};

export default AntAdminListCategory;
