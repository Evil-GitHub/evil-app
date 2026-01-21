import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, useIntl, useModel } from '@umijs/max';
import { App } from 'antd';
import classNames from 'classnames/bind';
import Settings from 'config/defaultSettings';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Footer } from '@/components';
import styles from './index.less';

const cx = classNames.bind(styles);

export async function login(params: {
  username: string;
  password: string;
  type: string;
}): Promise<{
  status: 'ok' | 'error';
  type: string;
  currentAuthority: string;
  message?: string;
}> {
  const { username, password, type } = params;

  return new Promise((resolve) => {
    setTimeout(() => {
      // ===== 登录成功：admin =====
      if (username === 'admin' && password === '123456') {
        resolve({
          status: 'ok',
          type,
          currentAuthority: 'admin',
        });
        return;
      }

      // ===== 登录成功：普通用户 =====
      if (username === 'user' && password === '123456') {
        resolve({
          status: 'ok',
          type,
          currentAuthority: 'user',
        });
        return;
      }

      // ===== 登录失败 =====
      resolve({
        status: 'error',
        type,
        currentAuthority: 'guest',
        message: '用户名或密码错误',
      });
    }, 500); // 模拟网络延迟
  });
}

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<{
    status: 'ok' | 'error';
    type: string;
    currentAuthority: string;
    message?: string;
  }>({
    status: 'ok',
    type: '',
    currentAuthority: '',
  });
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { message } = App.useApp();
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // 登录
      const msg = await login({ ...values, type });
      if (msg.status === 'ok') {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/';
        return;
      }
      console.log(msg);
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      console.log(error);
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>登录 - {Settings.title}</title>
      </Helmet>
      <div className={cx('login-content')}>
        <div className={cx('login-bg')} />
        <div className={cx('login-form')}>
          <LoginForm
            contentStyle={{
              minWidth: 280,
              maxWidth: '75vw',
            }}
            logo={<img alt="logo" src="/images/logo_simple.png" />}
            title={Settings?.title}
            onFinish={async (values) => {
              await handleSubmit(values as any);
            }}
          >
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder="请输入账号"
              rules={[
                {
                  required: true,
                  message: '请输入账号!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder="请输入密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </LoginForm>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Login;
