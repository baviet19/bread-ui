import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { updateCategory } from '../actions/categoryActions.js';
import { CATEGORY_UPDATE_RESET } from '../constants/categoryConstants';
import { CATEGORY_DETAILS_RESET } from '../constants/categoryConstants';
import { IMAGE_ADD_IMAGE_RESET } from '../constants/imageConstants';
import {
  Button,
  Layout,
  Breadcrumb,
  Form,
  Input,
  Upload,
  Select,
  message,
  Modal,
} from 'antd';
import 'antd/dist/antd.css';

import { createImage } from '../actions/imageAction';
import { getCategoryDetails } from '../actions/categoryActions.js';

const { Content } = Layout;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const AntAdminCategoryEdit = ({ history, match }) => {
  const categoryId = match.params.id;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.userLogin);
  const categoryDetails = useSelector((state) => state.categoryDetails);
  const { loading, error, category } = categoryDetails;
  const imageCreate = useSelector((state) => state.imageCreate);
  const categoryUpdate = useSelector((state) => state.categoryUpdate);
  const [fileList, setFileList] = useState([]);
  const [newFileList, setNewFileList] = useState([]);
  const [exisFileList, setExistFileList] = useState([]);
  const [categoryEdit, setCategoryEdit] = useState({});



  const [inputs, setInputs] = useState({
    name: '',
    description: '',
  });

  const {
    loading: loadingCreateImage,
    success: successCreateImage,
    error: errorCreateImage,
    images,
  } = imageCreate;

  const {
    loading: loadingUpdateCategory,
    success: successUpdateCategory,
    error: errorUpdateCategory,
    category: ressultCategory,
  } = categoryUpdate;

  const [file, setFile] = useState();

  // const [imageList, setImageList] = useState([]);

  useEffect(() => {
    if (!category.name || category.categoryId != categoryId) {
      dispatch(getCategoryDetails(categoryId));
    } else {
      setInputs(category);
      setFileList([{ url: category.image }]);
    }
  }, [dispatch, categoryId, category]);

  // console.log('hhahah', category);
  const { userInfo } = user;

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const validateMessages = {
    required: '${label} is required!',
    types: {
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
    string: {
      len: "'${name}' must be exactly ${len} characters",
      min: "'${name}' must be at least ${min} characters",
      max: "'${name}' cannot be longer than ${max} characters",
      range: "'${name}' must be between ${min} and ${max} characters",
    },
  };

  useEffect(() => {
    if (successCreateImage === true) {
      // console.log('uploaded', images.data.url);
      // console.log('exist', exisFileList);
      categoryEdit.image = images.data.url[0];
      dispatch(updateCategory(categoryId, categoryEdit));
      // console.log('____xxxxxxxxxxx', categoryEdit);
      dispatch({ type: IMAGE_ADD_IMAGE_RESET });
    } else if (successCreateImage === false) {
      message.warning('This is a warning message: ' + errorCreateImage);
    }
  }, [successCreateImage]);

  useEffect(() => {
    if (successUpdateCategory === true) {
      message.success('Edit category id: ' + ressultCategory.categoryId);
      // console.log('ok' + ressultCategory.categoryId);
      dispatch({ type: CATEGORY_UPDATE_RESET });
      dispatch({ type: CATEGORY_DETAILS_RESET });
      history.push('/admin/category');
    } else if (successUpdateCategory === false) {
      message.warning('This is a warning message: ' + errorUpdateCategory);
    }
  }, [successUpdateCategory]);

  // console.log(' file list', fileList);
  // console.log('new file list', newFileList);
  // console.log('exist file list', exisFileList);
  const onFinish = (values) => {
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
        values.category.name === category.name &&
        values.category.description === category.description &&
        check === false
      ) {
        message.warning('You not change');
      } else {
        setCategoryEdit(values.category);
        const fmData = new FormData();
        var checkUrl = -1;
        var checkNotUrl = -1;
        Array.from(fileList).forEach((image) => {
          if (image.url) {
            checkUrl = 0;
            // console.log('have url', image);
            setExistFileList([...exisFileList, image]);

            // setNewFileList(fileList.filter((item) => item.url !== image.url));
          } else {
            checkNotUrl = 0;
            // console.log('not url', image);
            setNewFileList([...newFileList, image]);
            fmData.append('files', image.originFileObj);
          }
        });
        if (checkNotUrl === 0) {
          // console.log('ok');
          dispatch(createImage(fmData));
        }

        if (checkNotUrl < 0 && checkUrl === 0) {
          // console.log('upload exist');
          values.category.image = category.image;
          dispatch(updateCategory(categoryId, values.category));
        }
      }
    }
  };

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
    // console.log('file____', newFile, fileList);

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
      // console.log('file', file, 'fileList', fileList);
      return true;
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
      // console.log('Eroor: ', err);
      const error = new Error('Some error');
      onError({ err });
    }
  };

  const handleOnChange = (changedValues, allValues) => {
    setInputs(allValues.category);
  };

  return (
    <Content style={{ margin: '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Category</Breadcrumb.Item>
        <Breadcrumb.Item>Edit</Breadcrumb.Item>
      </Breadcrumb>

      <Form
        // onFieldsChange={(e) => console.log(e)}
        onValuesChange={handleOnChange}
        preserve={false}
        {...layout}
        name='nest-messages'
        onFinish={onFinish}
        validateMessages={validateMessages}
        wrapperCol={{ sm: 24 }}
        style={{ width: '80%', marginRight: 0 }}
        fields={[
          {
            name: ['category', 'name'],
            value: inputs.name,
          },
          {
            name: ['category', 'description'],
            value: inputs.description,
          },
        ]}>
        <Form.Item
          name={['category', 'name']}
          label='Name'
          rules={[
            { required: true },
            { min: 10, message: 'Name must be minimum 10 characters.' },
            { max: 100, message: 'Name must be maximum 100 characters.' },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          name={['category', 'description']}
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
          label='Image'
          // name={['category', 'test']}
          // rules={[{ required: true }]}
        >
          <Upload
            customRequest={uploadImage}
            listType='picture-card'
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            accept='image/*'
            beforeUpload={handleupload}>
            {fileList.length < 1 && '+ Upload'}
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
      </Form>
    </Content>
  );
};

export default AntAdminCategoryEdit;
