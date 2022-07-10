import React, { useRef, useState, useEffect } from 'react';
import SockJsClient from 'react-stomp';
import { Comment, Form, List, Affix } from 'antd';
import { Avatar, message } from 'antd';
import { Upload, Modal } from 'antd';
import moment from 'moment';
import UserInfo from './UserInfo';
import { useDispatch, useSelector } from 'react-redux';

import 'react-chat-elements/dist/main.css';
import '../App.css';

import { IMAGE_ADD_IMAGE_RESET } from '../constants/imageConstants';
import { createImage } from '../actions/imageAction.js';

import { MessageBox } from 'react-chat-elements';
import { ChatItem } from 'react-chat-elements';
import { MessageList } from 'react-chat-elements';
import { SideBar } from 'react-chat-elements';
import { Navbar } from 'react-chat-elements';
import { Input } from 'react-chat-elements';
import { Button } from 'react-chat-elements';
import { Row, Col } from 'antd';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const MessageSockjs = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const refSockJs = useRef(null);
  const inputRef = useRef();
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const imageCreate = useSelector((state) => state.imageCreate);
  const {
    loading: loadingCreateImage,
    success: successCreateImage,
    error: errorCreateImage,
    images,
  } = imageCreate;

  const handleOnConnect = () => {
    console.log('connect');
  };

  const handleSubmit = () => {
    console.log('submit', value);
    if (!value && fileList.length === 0) {
      return;
    }

    // refSockJs.current.sendMessage(
    //   '/app/hello',
    //   JSON.stringify(`${userInfo.phone}_${value}`)
    // );

    if (fileList.length === 0) {
      let message = {
        name: `${userInfo.id}`,
        message: `${value}`,
        urlImage: '',
        date: new Date(),
      };
      refSockJs.current.sendMessage(
        `/app/sendMessageToAdmin/${userInfo.id}`,

        JSON.stringify(message)
      );
    } else {
      const fmData = new FormData();

      Array.from(fileList).forEach((image) => {
        console.log(image);
        fmData.append('files', image.originFileObj);
      });

      dispatch(createImage(fmData));
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  let t = 0;
  const onMessageR = (content) => {
    console.log('okeR', content);
    console.log('okeR', messages, t++);
    // setSubmitting(true);

    // const authorRe = content.split('_')[0];
    // const contentRe = content.replace(authorRe + '_', '');
    // // console.log('oke', getContent(content));
    setTimeout(() => {
      inputRef.current.clear();
      setMessages([
        ...messages,
        {
          position: 'right',
          type: content.urlImage != '' ? 'photo' : 'text',
          text: content.message,
          date: Date.parse(content.date),
          data: {
            uri: content.urlImage,
          },
        },
      ]);
    }, 10);
  };

  //////////////////////

  const [fileList, setFileList] = useState([]);

  const [file, setFile] = useState();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (successCreateImage === true) {
      var uri = '';

      Array.from(images.data.url).forEach((image) => {
        // console.log('rul', image);
        uri = image;
        // setImageRessult(...imageRessult, { url: image });
      });

      let message = {
        name: `${userInfo.id}`,
        message: `${value}`,
        urlImage: uri,
        date: new Date(),
      };
      refSockJs.current.sendMessage(
        `/app/sendMessageToAdmin/${userInfo.id}`,

        JSON.stringify(message)
      );

      // product.images = list;
      // console.log('rul', product);

      // dispatch(createProduct(product));
      // console.log('____xxxxxxxxxxx', product);
      setFileList([]);
      dispatch({ type: IMAGE_ADD_IMAGE_RESET });
    } else if (successCreateImage === false) {
      message.warning('This is a warning message: ' + errorCreateImage);
    }
  }, [successCreateImage]);

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

  const onChange = ({ fileList: newFileList, file: newFile }) => {
    console.log(newFile);
    const isJPG = newFile.type === 'image/jpeg' || newFile.type === 'image/png';
    const isLt2M = newFile.size / 1024 / 1024 < 2;

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

  /////////////////////////////

  ////////////////////////

  const onMessageL = (content) => {
    console.log('okeL', content);
    console.log('okeL', messages, t++);
    setTimeout(() => {
      // inputRef.current.clear();
      setMessages([
        ...messages,
        {
          position: 'left',
          type: content.urlImage != '' ? 'photo' : 'text',
          text: content.message,
          date: Date.parse(content.date),
          data: {
            uri: content.urlImage,
          },
        },
      ]);
    }, 10);
  };
  return (
    <div className='chat'>
      <MessageList
        className='message-list'
        lockable={true}
        toBottomHeight={'100%'}
        dataSource={messages}
      />

      <div className='input-chat-user'>
        <div>
          <Upload
            customRequest={uploadImage}
            listType='picture-card'
            file={file}
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
        </div>

        <div>
          <Input
            ref={inputRef}
            placeholder='Type here...'
            multiline={false}
            onChange={handleChange}
            rightButtons={
              <Button
                color='white'
                backgroundColor='black'
                text='Send'
                onClick={handleSubmit}
              />
            }
          />
        </div>
      </div>

      <SockJsClient
        ref={refSockJs}
        url='https://webhook-dialog-flow-spring-boo.herokuapp.com/gs-guide-websocket'
        topics={[`/topic/reciveMessage/${userInfo.id}`]}
        onMessage={(msg) => {
          onMessageL(msg);
        }}
        onConnect={handleOnConnect}
        onDisconnect={() => {
          console.log('dis');
        }}
      />

      <SockJsClient
        ref={refSockJs}
        url='https://webhook-dialog-flow-spring-boo.herokuapp.com/gs-guide-websocket'
        topics={[`/topic/reciveMySelftMessageToAdmin/${userInfo.id}`]}
        onMessage={(msg) => {
          onMessageR(msg);
        }}
        onConnect={handleOnConnect}
        onDisconnect={() => {
          console.log('dis');
        }}
      />
    </div>
  );
};

export default MessageSockjs;
