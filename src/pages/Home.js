import React from 'react';
import AntCarousel from '../components/AntCarousel';
import AntProductList from '../components/AntProductList';
import useScript from '../hooks/useScript';
import { useSelector } from 'react-redux';

const Home = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  window.addEventListener('botcopy-events', function (e) {
    console.log('botcopy-events', e.detail.type);
    console.log('botcopy', global.Botcopy);
    switch (e.detail.type) {
      case 'bc-user-input-sent':
        global.Botcopy.setESParameters({
          webhookHeaders: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          },
          payload: {
            fields: {
              name: { stringValue: 'Lisa' },
              age: { numberValue: 32 },
            },
          },
        });
      case 'bc-initialized':
        break;
      case 'bc-agent-entered-chat':
        break;
      case 'bc-agent-message-sent':
        break;
    }
  });

  // console.log('xx', global);
  useScript(
    'https://widget.botcopy.com/js/injection.js',
    'botcopy-embedder-d7lcfheammjct'
  );

  return (
    <main>
      <AntCarousel />
      <AntProductList />
      {/* <df-messenger
        intent='WELCOME'
        chat-title='chatbug'
        agent-id='c03a2d90-22ed-47e0-ac70-4c1e40a5260b'
        language-code='vi'></df-messenger> */}

      {userInfo != null ? (
        <div
          id='botcopy-embedder-d7lcfheammjct'
          className='botcopy-embedder-d7lcfheammjct'
          data-botId='61162b71e7d6320009990b25'></div>
      ) : (
        <></>
      )}
      {/* <script
        type='text/javascript'
        id='botcopy-embedder-d7lcfheammjct'
        class='botcopy-embedder-d7lcfheammjct'
        data-botId='61162b71e7d6320009990b25'></script> */}
    </main>
  );
};

export default Home;
