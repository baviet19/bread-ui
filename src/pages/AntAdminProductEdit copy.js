import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { updateProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import { IMAGE_ADD_IMAGE_RESET } from '../constants/imageConstants';
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
  Tag,
} from 'antd';
import 'antd/dist/antd.css';

import ImgCrop from 'antd-img-crop';
import { createImage } from '../actions/imageAction';
import API from '../api';
import { listCategories } from '../actions/categoryActions.js';
import { getProductDetails } from '../actions/productActions.js';
const { Content } = Layout;
const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const AntAdminProductEdit = ({ history, match }) => {
  const productId = match.params.id;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userLogin);
  const categoryList = useSelector((state) => state.categoryList);
  const productDetails = useSelector((state) => state.productDetails);
  const { loading: loadingListCategory, error, categories } = categoryList;
  const { loading: loadingDetail, errorr, product } = productDetails;
  const productUpdate = useSelector((state) => state.productUpdate);
  const imageCreate = useSelector((state) => state.imageCreate);
  const [newFileList, setNewFileList] = useState([]);
  const [exisFileList, setExistFileList] = useState([]);
  const [productEdit, setProductEdit] = useState({});

  const {
    loading: loadingCreateImage,
    success: successCreateImage,
    error: errorCreateImage,
    images,
  } = imageCreate;

  const {
    loading: loadingUpdateProduct,
    success: successUpdateProduct,
    error: errorUpdateProduct,
    product: ressultProduct,
  } = productUpdate;

  const [fileList, setFileList] = useState([{}]);

  // useEffect(() => {
  //   if (!product.name || product.foodId != productId) {
  //     console.log('2');
  //     dispatch(getProductDetails(productId));
  //   } else {
  //     console.log('3');
  //     console.log(product);
  //     setFileList(product.images);
  //     console.log(fileList);
  //   }
  // }, [dispatch, productId, product]);

  useEffect(() => {
    if (typeof product === 'undefined') {
      console.log('2');
      dispatch(getProductDetails(productId));
    } else {
      console.log('3');
      console.log(product);
      setFileList(product.images);
      console.log(fileList);
    }
  }, [dispatch, productId, product]);

  console.log('hhahah', fileList);

  useEffect(() => {
    if (successUpdateProduct === true) {
      message.success('Edit product id: ' + ressultProduct.foodId);

      dispatch({ type: PRODUCT_CREATE_RESET });
      history.push('/admin/products');
    } else if (successUpdateProduct === false) {
      message.warning('This is a warning message: ' + errorUpdateProduct);
    }
  }, [successUpdateProduct]);

  useEffect(() => {
    if (successCreateImage === true) {
      console.log('exist file', exisFileList);

      var list = [];

      Array.from(images.data.url).forEach((image) => {
        // console.log('rul', image);
        list.push({ url: image });
        // setImageRessult(...imageRessult, { url: image });
      });

      Array.from(exisFileList).forEach((image) => {
        // console.log('rul_exst', image);
        list.push(image);
        // setImageRessult(...imageRessult, { url: image });
      });

      productEdit.images = list;
      console.log('new ', productEdit);

      // console.log('uploaded', images.data.url);
      // console.log('exist', exisFileList);

      // productEdit.images = images.data.url[0];

      dispatch(updateProduct(productId, productEdit));

      dispatch({ type: IMAGE_ADD_IMAGE_RESET });
    } else if (successCreateImage === false) {
      message.warning('This is a warning message: ' + errorCreateImage);
    }
  }, [successCreateImage]);

  let nameCategory;
  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

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
    //////////////

    if (fileList.length === 0) {
      message.warning('Please add image');
    } else {
      var check = false;
      Array.from(fileList).forEach((image) => {
        if (image.url) {
        } else {
          check = true;
        }
      });

      if (
        values.product.name === product.name &&
        values.product.description === product.description &&
        check === false
      ) {
        message.warning('You not change');
      } else {
        if (values.product.categoryId === nameCategory) {
          values.product.categoryId = product.categoryId;
          console.log('bang', values.product);
        } else {
          values.product.categoryId = Number(values.product.categoryId);
          console.log('ko bang', productEdit);
        }

        setProductEdit(values.product);

        const fmData = new FormData();
        var checkUrl = -1;
        var checkNotUrl = -1;
        Array.from(fileList).forEach((image) => {
          if (image.url) {
            checkUrl = 0;
            console.log('have url', image);
            setExistFileList([...exisFileList, image]);

            // setNewFileList(fileList.filter((item) => item.url !== image.url));
          } else {
            checkNotUrl = 0;
            console.log('not url', image);
            setNewFileList([...newFileList, image]);
            fmData.append('files', image.originFileObj);
          }
        });

        if (checkNotUrl === 0) {
          console.log('ok');
          dispatch(createImage(fmData));
        }

        if (checkNotUrl < 0 && checkUrl === 0) {
          values.product.images = product.images;

          console.log('upload exist' + JSON.stringify(values.product));
          dispatch(updateProduct(productId, values.product));
        }
      }
    }

    //////////
    // if (values.product.category === nameCategory) {
    //   values.product.category = product.categoryId;
    // }
    // values.product.category = Number(values.product.category);
    // values.product.images = imageList;
    // console.log(values);
  };

  if (loadingListCategory === false) {
    nameCategory = categories.find(
      (x) => x.categoryId === product.categoryId
    ).name;
  }
  const [imageList, setImageList] = useState([]);

  const [file, setFile] = useState();

  function onChangePrice(value) {
    console.log('changed', value);
  }

  ///

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [progress, setProgress] = useState(0);

  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  ///
  const onChange = ({ fileList: newFileList, file: newFile }) => {
    if (newFile.url) {
      const filteredFile = fileList.filter((item) => item.url !== newFile.url);
      setFileList(filteredFile);
      // let obj = fileList.find((o) => o.url === newFile.url);
      // console.log('__________', filteredFile);

      // console.log('__________', newFile.url);
      // var index = fileList.indexOf(newFile);
      // console.log('__________', index);
      // if (index !== -1) {
      //   fileList.splice(index, 1);
      // }
      // console.log('__________', fileList);
    }

    const isJPG = newFile.type === 'image/jpeg' || newFile.type === 'image/png';
    const isLt2M = newFile.size / 1024 / 1024 < 2;

    // if(file.)
    if (!isJPG || !isLt2M) {
    } else {
      setFileList(newFileList);
      setFile(newFile);
    }
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const config = {
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };

    try {
      onSuccess('Ok');
    } catch (err) {
      console.log('Eroor: ', err);
      const error = new Error('Some error');
      onError({ err });
    }
  };

  const handleupload = (file, fileList) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    }
    if (!isJPG) {
      message.error('You can only upload JPG or PNG file!');

      return false;
    } else {
      console.log('file', file, 'fileList', fileList);
      return true;
    }
  };

  return (
    <Content style={{ margin: '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>User</Breadcrumb.Item>
        <Breadcrumb.Item>Bill</Breadcrumb.Item>
      </Breadcrumb>

      {/* <Form
        {...layout}
        name='nest-messages'
        onFinish={onFinish}
        validateMessages={validateMessages}
        wrapperCol={{ sm: 24 }}
        style={{ width: '80%', marginRight: 0 }}
        fields={[
          {
            name: ['product', 'name'],
            value: product.name,
          },
          {
            name: ['product', 'quantity'],
            value: product.quantity,
          },
          {
            name: ['product', 'price'],
            value: product.price,
          },
          {
            name: ['product', 'description'],
            value: product.description,
          },
          {
            name: ['product', 'categoryId'],
            value: nameCategory,
          },
          {
            name: ['product', 'status'],
            value: product.status,
          },
        ]}>
        <Form.Item
          name={['product', 'name']}
          label='Name'
          rules={[
            { required: true },
            { min: 10, message: 'Name must be minimum 10 characters.' },
            { max: 100, message: 'Name must be maximum 100 characters.' },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          name={['product', 'price']}
          label='Price'
          rules={[{ type: 'number' }, { required: true }]}>
          <InputNumber
            min={0}
            step={5000}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            onChange={onChangePrice}
          />
        </Form.Item>
        <Form.Item
          name={['product', 'quantity']}
          label='Quantity'
          rules={[{ type: 'number', min: 0, max: 1000 }, { required: true }]}>
          <InputNumber />
        </Form.Item>

        <Form.Item
          name={['product', 'description']}
          label='Description'
          rules={[
            { required: true },
            { min: 10, message: 'Description must be minimum 10 characters.' },
            {
              max: 100,
              message: 'Description must be maximum 100 characters.',
            },
          ]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name={['product', 'categoryId']}
          label='Category'
          rules={[{ required: true }]}>
          <Select
            // labelInValue

            placeholder='Search to Select'
            style={{ width: 240 }}
            showSearch
            // onChange={handleProvinceChange}
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }>
            {categories.map((category) => (
              <Option key={category.categoryId}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name={['product', 'status']}
          label='Status'
          rules={[{ required: true }]}>
          <Select
            // labelInValue

            placeholder='Search to Select'
            style={{ width: 240 }}
            showSearch
            // onChange={handleProvinceChange}
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }>
            {['AVAILABLE', 'UNAVAILABLE'].map((item) => (
              <Option key={item}>
                {item === 'AVAILABLE' ? (
                  <Tag color='blue'>{item}</Tag>
                ) : (
                  <Tag color='volcano'>{item}</Tag>
                )}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label='Image'
          // rules={[{ required: true }]}
        >
          <Upload
            customRequest={uploadImage}
            listType='picture-card'
            file={file}
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            accept='image/*'
            beforeUpload={handleupload}>
            {fileList.length < 5 && '+ Upload'}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}>
            <img alt='example' style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 14 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form> */}
    </Content>
  );
};

export default AntAdminProductEdit;
