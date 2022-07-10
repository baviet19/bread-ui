import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './components/AdminNav';
import AntAdminProductEdit from './pages/AntAdminProductEdit';
import AntAdminProductAdd from './pages/AntAdminProductAdd';
import AntdAdminListProducts from './pages/AntdAdminListProducts';
import AntAdminListCategory from './pages/AntAdminListCategory';
import AntAdminCategoryAdd from './pages/AntAdminCategoryAdd';
import AntAdminCategoryEdit from './pages/AntAdminCategoryEdit';
import AntAdminListOrders from './pages/AntAdminListOrders';
import AntAdminListUser from './pages/AntAdminListUser';
import AntProductDetail from './pages/AntProductDetail';
import AntCart from './pages/AntCart';
import AntOrder from './pages/AntOrder';
import AntError from './components/AntError';
import Logout from './components/Logout';
import { Layout } from 'antd';
import NotFound from './components/NotFound';
import AntOrderInfo from './pages/AntOrderInfo';
import AntAdminUserEdit from './pages/AntAdminUserEdit';
import AntAdminUserAdd from './pages/AntAdminUserAdd';
import UserInfo from './pages/UserInfo';

import SampleComponent from './test/SampleComponent';
import MessageSockjs from './pages/MessageSockjs';
import AdminMessageSockjs from './pages/AdminMessageSockjs';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';

function App() {
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  let isUser;
  let isAdmin;
  if (userInfo) {
    isUser = userInfo.roles
      .map(function (e) {
        return e;
      })
      .indexOf('ROLE_USER');

    isAdmin = userInfo.roles
      .map(function (e) {
        return e;
      })
      .indexOf('ROLE_ADMIN');
  }

  return (
    <Router>
      <div className='App'>
        <Layout style={{ minHeight: '100vh' }}>
          <Admin />
          <Layout className='site-layout'>
            <Switch>
              <Route exact path='/test' component={SampleComponent} />

              <Route
                exact
                path='/message'
                component={isAdmin > -1 || isUser > -1 ? MessageSockjs : Login}
              />

              <Route
                exact
                path='/admin/message'
                component={isAdmin > -1 ? AdminMessageSockjs : Login}
              />

              <Route
                exact
                path='/admin/dashboard'
                component={
                  isAdmin > -1 ? AdminDashboard : isUser > -1 ? AntError : Login
                }
              />
              <Route
                exact
                path='/admin/products'
                component={
                  isAdmin > -1
                    ? AntdAdminListProducts
                    : isUser > -1
                    ? AntError
                    : Login
                }
              />
              <Route
                exact
                path='/admin/products/add'
                component={
                  isAdmin > -1
                    ? AntAdminProductAdd
                    : isUser > -1
                    ? AntError
                    : Login
                }
              />
              <Route
                exact
                path='/admin/products/:id/edit'
                component={
                  isAdmin > -1
                    ? AntAdminProductEdit
                    : isUser > -1
                    ? AntError
                    : Login
                }
              />

              <Route
                exact
                path='/admin/users/add'
                component={
                  isAdmin > -1
                    ? AntAdminUserAdd
                    : isUser > -1
                    ? AntError
                    : Login
                }
              />
              <Route
                exact
                path='/admin/users/:id/edit'
                component={
                  isAdmin > -1
                    ? AntAdminUserEdit
                    : isUser > -1
                    ? AntError
                    : Login
                }
              />

              <Route
                exact
                path='/admin/category'
                component={
                  isAdmin > -1
                    ? AntAdminListCategory
                    : isUser > -1
                    ? AntError
                    : Login
                }
              />

              <Route
                exact
                path='/admin/category/add'
                component={
                  isAdmin > -1
                    ? AntAdminCategoryAdd
                    : isUser > -1
                    ? AntError
                    : Login
                }
              />
              <Route
                path='/admin/category/:id/edit'
                component={
                  isAdmin > -1
                    ? AntAdminCategoryEdit
                    : isUser > -1
                    ? AntError
                    : Login
                }
              />
              <Route
                exact
                path='/admin/orders'
                component={
                  isAdmin > -1
                    ? AntAdminListOrders
                    : isUser > -1
                    ? AntError
                    : Login
                }
              />
              <Route
                exact
                path='/admin/users'
                component={
                  isAdmin > -1
                    ? AntAdminListUser
                    : isUser > -1
                    ? AntError
                    : Login
                }
              />

              <Route exact path='/products/:id' component={AntProductDetail} />
              <Route exact path='/userinfo' component={UserInfo} />
              <Route
                exact
                path='/cart/:id?'
                component={
                  isUser > -1 ? AntCart : isAdmin > -1 ? AntError : Login
                }
              />
              <Route
                exact
                path='/orders'
                component={
                  isUser > -1 ? AntOrder : isAdmin > -1 ? AntError : Login
                }
              />

              <Route path='/logout' component={Logout} />
              {/*  */}

              <Route exact path='/' component={Home} />
              <Route exact path='/search/:keyword' component={Home} />

              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />

              <Route
                path='/myorder'
                component={
                  isUser > -1 ? AntOrderInfo : isAdmin > -1 ? AntError : Login
                }
              />

              <Route path='*' component={NotFound} />
            </Switch>
          </Layout>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
