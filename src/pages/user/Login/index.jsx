import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs, } from 'antd';
import React, { useState } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
// import Footer from '@/components/Footer';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import styles from './index.less';
// import route from '../../../../mock/route';
import Register from './Register';
import * as services from './services';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const [name, setName] = useState('initname'); //用户姓名
  let registerRef = null; //子节点标签
  const { initialState, setInitialState } = useModel('@@initialState'); //用于全局管理登陆者信息
  const intl = useIntl();
  const { status, type: loginType } = userLoginState;

  const fetchUserInfo = async (userMsg) => {
    // const userInfo = await initialState?.fetchUserInfo?.();
    const userInfo = {
      ...userMsg.data,
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png', //头像
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      tags: [
        {
          key: '0',
          label: '很有想法的',
        },
        {
          key: '1',
          label: '专注设计',
        },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      access: 'admin',
      // phone:17353030913
      // geographic: {
      //   province: {
      //     label: '浙江省',
      //     key: '330000',
      //   },
      //   city: {
      //     label: '杭州市',
      //     key: '330100',
      //   },
      // },
      // address: '西湖区工专路 77 号',
    };
    if (userInfo) {
      await setInitialState((s) => {
        return { ...s, currentUser: userInfo };
      });
    }
  };

  const handleSubmit = async (values) => {
    // try {
    // 登录
    await services.login(values).then(async (res) => {
      const msg = res.data;
      if (msg.code === 0) {
        console.log('用户信息：',msg.data);
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo(msg);
        //房东
        if(msg.data.userType===1){
          history.push('/houseSummary');
        }else if(msg.data.userType===2){//租客
          history.push('/houseSummary')
        }else if(msg.data.userType===0){//超管
          history.push('/houseSummary')
        }
      } else if (msg.code === -1) {
        message.error('请检查账号密码');
      }
    });
  };

  //点击注册
  const handleRegistered = async () => {
    // await setInitialState((s) => ({ ...s, currentUser: {} }));
    if (registerRef) {
      registerRef.handleRegister(); //调用处弹框
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={
            <img
              alt="logo"
              src={`https://uploadfile.huiyi8.com/up/b1/79/20/b17920d9a5413337f83258fe7039d333.png.270.jpg`}
            />
          }
          title="易租居房源管理系统"
          subTitle={'易租居房源管理系统管理您的住宅'}
          initialValues={{
            autoLogin: true,
          }}
          actions={
            [
              // <FormattedMessage
              //   key="loginWith"
              //   id="pages.login.loginWith"
              //   defaultMessage="其他登录方式"
              // />,
              // <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
              // <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
              // <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
            ]
          }
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
            <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.phoneLogin.tab',
                defaultMessage: '手机号登录',
              })}
            />
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="account"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: admin or user',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: admin123/user123',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }

                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });

                  if (result === false) {
                    return;
                  }

                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
              onClick={handleRegistered}
            >
              <FormattedMessage id="menu.registered.users" defaultMessage="注册用户" />
            </a>
            <Register
              onRef={(ref) => {
                registerRef = ref;
              }}
            ></Register>
          </div>
        </LoginForm>
      </div>
      {/*<Footer />*/}
    </div>
  );
};

export default Login;
