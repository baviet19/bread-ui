import React, { useRef, useState, useEffect } from 'react';
import SockJsClient from 'react-stomp';
import { useSelector } from 'react-redux';
import {
  Comment,
  Avatar,
  Form,
  Button,
  List,
  Input,
  Affix,
  Layout,
} from 'antd';
import moment from 'moment';
import UserInfo from '../pages/UserInfo';
import { Bar } from 'react-chartjs-2';

const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout='horizontal'
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType='submit'
        loading={submitting}
        onClick={onSubmit}
        type='primary'>
        Send
      </Button>
    </Form.Item>
  </>
);

const SampleComponent = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const refSockJs = useRef(null);
  const [label, setLabel] = useState([]);
  const [data, setData] = useState([]);
  const [connect, setConnect] = useState(false);

  useEffect(() => {
    console.log('label', label);
    console.log('data', data);

    if (connect === true) {
      refSockJs.current.sendMessage(
        '/app/hi',
        JSON.stringify(`${userInfo.phone}_${value}`)
      );
    }
  }, [connect]);

  const handleOnConnect = () => {
    console.log('connect');
    setConnect(true);
  };

  const handleButonClick = () => {};

  const handleSubmit = () => {
    if (!value) {
      return;
    }

    refSockJs.current.sendMessage(
      '/app/hi',
      JSON.stringify(`${userInfo.phone}_${value}`)
    );
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const getContent = (content) => {
    let index = content.indexOf('_');
    let newString = content.substring(index, content.length());
    return newString;
  };

  const onMessage = (content) => {
    var obj = JSON.parse(content);

    console.log(obj);

    var l = [];
    var d = [];
    for (var i = 0, iLen = obj.length; i < iLen; i++) {
      console.log(obj[i]);
      l.push(obj[i][0]);
      d.push(obj[i][1]);
    }

    console.log('label', l);
    console.log('data', d);
    setLabel(l);
    setData(d);

    setSubmitting(true);

    setSubmitting(false);

    // const authorRe = content.split('_')[0];
    // const contentRe = content.replace(authorRe + '_', '');
    // // console.log('oke', getContent(content));
    // setTimeout(() => {
    //   setValue('');
    //   setSubmitting(false);
    //   setComments([
    //     ...comments,
    //     {
    //       author: authorRe,
    //       avatar:
    //         'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    //       content: <p>{contentRe}</p>,
    //       datetime: moment().fromNow(),
    //     },
    //   ]);
    // }, 10);
  };

  const dataChart = {
    labels: label,
    datasets: [
      {
        label: '# top',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div>
      <Bar data={dataChart} options={options} />

      <div style={{ height: '200px' }}>
        {comments.length > 0 && <CommentList comments={comments} />}
      </div>

      <Affix offsetTop={400}>
        <Comment
          avatar={
            <Avatar
              src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
              alt='Han Solo'
            />
          }
          content={
            <Editor
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </Affix>
      <SockJsClient
        ref={refSockJs}
        url='http://localhost:8080/gs-guide-websocket'
        topics={['/topic/dasboards']}
        onMessage={(msg) => {
          onMessage(msg.content);
        }}
        onConnect={handleOnConnect}
      />
    </div>
  );
};

export default SampleComponent;
