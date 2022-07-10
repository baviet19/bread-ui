import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SockJsClient from 'react-stomp';
import { Avatar, message } from 'antd';
import { Upload, Modal } from 'antd';

import moment from 'moment';
import { MessageList } from 'react-chat-elements';
import UserInfo from './UserInfo';
import 'react-chat-elements/dist/main.css';
import { Button } from 'react-chat-elements';
import { Input } from 'react-chat-elements';
import { ChatList } from 'react-chat-elements';

import { Row, Col } from 'antd';
import '../App.css';
import { listUsers } from '../actions/userActions.js';
import AntLoader from '../components/AntLoading.js';
import AntError from '../components/AntError.js';
import logo from '../logo.svg';
import { IMAGE_ADD_IMAGE_RESET } from '../constants/imageConstants';
import { createImage } from '../actions/imageAction.js';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const AdminMessageSockjs = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const refSockJs = useRef(null);
  const inputRef = useRef();
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  var chatListA = [];
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { loading: loadingUsers, error: errorUsers, users } = userList;
  const [userIdSe, setUserIdSe] = useState('');
  const [connect, setConnect] = useState(false);
  const messagesEndRef = useRef(null);

  const imageCreate = useSelector((state) => state.imageCreate);
  const {
    loading: loadingCreateImage,
    success: successCreateImage,
    error: errorCreateImage,
    images,
  } = imageCreate;

  const [test, setTest] = useState([]);
  useEffect(() => {
    console.log('sssssssssssssss');
    dispatch(listUsers());
  }, []);

  useEffect(() => {
    if (loadingUsers === false) {
      users.map((item) => {
        chatListA.push({
          avatar: logo,
          alt: 'Reactjs',
          title: `${item.phone}`,
          // subtitle: 'What are you doing?',
          // date: new Date(),

          date: null,
          unread: 0,
          key: `${item.userId}`,
          phone: `${item.phone}`,
        });
      });
      setChatList(chatListA);
    }
  }, [loadingUsers]);

  const handleOnConnect = () => {
    console.log('connect');
    setConnect(true);
  };

  const scrollToBottom = () => {
    console.log(messagesEndRef);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleSubmit = () => {
    if (!value && fileList.length === 0) {
      return;
    }

    if (fileList.length === 0) {
      let message = {
        name: `${userInfo.id}`,
        message: `${value}`,
        urlImage: '',
        date: new Date(),
      };
      refSockJs.current.sendMessage(
        `/app/sendMessage/${userIdSe}`,

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

  const handleSelectId = (id) => {
    setUserIdSe(id);
    if (JSON.parse(localStorage.getItem(id)) !== null) {
      setMessages(JSON.parse(localStorage.getItem(id)));
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    console.log('asasa', messages);
    // scrollToBottom();
  }, [userIdSe]);

  let t = 0;
  const onMessageR = (content) => {
    if (t === 0) {
      console.log('okeR', content);
      console.log('okeRsssssssssss', userIdSe);

      if (JSON.parse(localStorage.getItem(userIdSe)) === null) {
        localStorage.setItem(userIdSe, JSON.stringify([]));
      }
      localStorage.setItem(
        userIdSe,
        JSON.stringify([
          ...JSON.parse(localStorage.getItem(userIdSe)),
          {
            position: 'right',
            type: content.urlImage != '' ? 'photo' : 'text',
            text: content.message,
            date: Date.parse(content.date),
            data: {
              uri: content.urlImage,
            },
          },
        ])
      );
      console.log('localRRRRR____', JSON.parse(localStorage.getItem(userIdSe)));

      setTimeout(() => {
        inputRef.current.clear();
        setMessages(JSON.parse(localStorage.getItem(userIdSe)));
      }, 10);
    }
  };

  const onMessageL = (content) => {
    console.log('okeLLLLL', t);
    if (t === 0) {
      console.log('okeL', messages);
      if (JSON.parse(localStorage.getItem(userIdSe)) === null) {
        localStorage.setItem(userIdSe, JSON.stringify([]));
        localStorage.setItem(
          content.name,
          JSON.stringify([
            {
              position: 'left',
              type: content.urlImage != '' ? 'photo' : 'text',
              text: content.message,
              date: Date.parse(content.date),
              data: {
                uri: content.urlImage,
              },
            },
          ])
        );
      } else {
        localStorage.setItem(
          content.name,
          JSON.stringify([
            ...JSON.parse(localStorage.getItem(content.name)),
            {
              position: 'left',
              type: content.urlImage != '' ? 'photo' : 'text',
              text: content.message,
              date: Date.parse(content.date),
              data: {
                uri: content.urlImage,
              },
            },
          ])
        );
      }

      console.log(
        'local____',
        ...JSON.parse(localStorage.getItem(content.name))
      );

      // console.log('okeL', messages, t++);
      if (content.name == userIdSe) {
        setTimeout(() => {
          // inputRef.current.clear();
          setMessages(JSON.parse(localStorage.getItem(content.name)));
        }, 10);
      }

      t++;
    }
  };

  ///////////////////////////////

  // const onFinish = (values) => {
  //   // values.product.images = imageList;
  //   // console.log(values);

  //   if (fileList.length === 0) {
  //     message.warning('Please add image');
  //   } else {
  //     const fmData = new FormData();

  //     setProduct(values.product);

  //     Array.from(fileList).forEach((image) => {
  //       console.log(image);
  //       fmData.append('files', image.originFileObj);
  //     });

  //     dispatch(createImage(fmData));
  //   }
  // };

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
        `/app/sendMessage/${userIdSe}`,

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
  return (
    // style={({ height: '200px' }, { overflowY: 'auto' })}

    loadingUsers ? (
      <AntLoader />
    ) : error ? (
      <AntError />
    ) : (
      <div className='chat'>
        <Row>
          <Col span={18} push={6}>
            {userIdSe != '' ? (
              <div>
                {/* <>
                  <Avatar
                    style={{
                      backgroundColor: '#f56a00',
                      verticalAlign: 'middle',
                    }}
                    size='large'>
                    {userIdSe}
                  </Avatar>
                </> */}
                <div>
                  <MessageList
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={messages}
                  />
                  <div ref={messagesEndRef} />
                </div>

                <div className='input-chat'>
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
                      <img
                        alt='example'
                        style={{ width: '100%' }}
                        src={previewImage}
                      />
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
              </div>
            ) : (
              <></>
            )}
          </Col>
          <Col span={6} pull={18}>
            <div>
              <ChatList
                className='chat-list'
                dataSource={chatList}
                onClick={(e) => {
                  handleSelectId(e.key);
                }}
              />
            </div>
          </Col>
        </Row>

        <SockJsClient
          ref={refSockJs}
          url='https://webhook-dialog-flow-spring-boo.herokuapp.com/gs-guide-websocket'
          topics={[`/topic/reciveMessageFromUser/${userIdSe}`]}
          onMessage={(msg) => {
            onMessageL(msg);
          }}
          onConnect={handleOnConnect}
        />

        <SockJsClient
          ref={refSockJs}
          url='https://webhook-dialog-flow-spring-boo.herokuapp.com/gs-guide-websocket'
          topics={[`/topic/reciveMySelftMessage/${userIdSe}`]}
          onMessage={(msg) => {
            onMessageR(msg);
          }}
          onConnect={handleOnConnect}
        />
      </div>
    )
  );
};

export default AdminMessageSockjs;
