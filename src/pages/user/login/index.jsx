import { Alert, Checkbox, Icon, Input } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';

import styles from './style.less';

// 关闭校验警告
// const Schema = require('async-validator');

import Schema from 'async-validator';
Schema.warning = () => { };


const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;
const InputPassword = Input.Password;
@connect(({ admin, loading }) => ({
  userLogin: admin,
  submitting: loading.effects['admin/loginPwd'],
}))
class Login extends Component {
  loginForm = undefined;
  state = {
    type: 'account',
    autoLogin: true,
  };
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  handleSubmit = (err, values) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'admin/loginPwd',
        payload: { ...values, type },
      });
    }
  };
  onTabChange = type => {
    this.setState({
      type,
    });
  };
  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, async (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;

          try {
            const success = await dispatch({
              type: 'login/getCaptcha',
              payload: values.mobile,
            });
            resolve(!!success);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render () {
    const { userLogin, submitting } = this.props;
    const { status, type: loginType } = userLogin;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={form => {
            this.loginForm = form;
          }}
        >
          {/*
            <Tab
              key="account"
              tab={formatMessage({
                id: 'user-login.login.tab-login-credentials',
              })}
            >
          */}
          {status === 'error' &&
            loginType === 'account' &&
            !submitting &&
            this.renderMessage(
              formatMessage({
                id: 'user-login.login.message-invalid-credentials',
              }),
            )}
          <UserName
            name="userName"
            placeholder="请输入用户名"
            rules={[
              {
                required: true,
                message: '用户名不能为空',
              },
              {
                min: 5,
                max: 20,
                message: '用户名为5-20个字符',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '密码不能为空',
              },
              {
                min: 6,
                max: 20,
                message: '密码为6-20个字符',
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();

              if (this.loginForm) {
                this.loginForm.validateFields(this.handleSubmit);
              }
            }}
          />
          {/* <InputPassword></InputPassword> */}
          {/* </Tab> */}
          {/*
            <Tab
              key="mobile"
              tab={formatMessage({
                id: 'user-login.login.tab-login-mobile',
              })}
            >
              {status === 'error' &&
                loginType === 'mobile' &&
                !submitting &&
                this.renderMessage(
                  formatMessage({
                    id: 'user-login.login.message-invalid-verification-code',
                  }),
                )}
              <Mobile
                name="mobile"
                placeholder={formatMessage({
                  id: 'user-login.phone-number.placeholder',
                })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'user-login.phone-number.required',
                    }),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: formatMessage({
                      id: 'user-login.phone-number.wrong-format',
                    }),
                  },
                ]}
              />
              <Captcha
                name="captcha"
                placeholder={formatMessage({
                  id: 'user-login.verification-code.placeholder',
                })}
                countDown={120}
                onGetCaptcha={this.onGetCaptcha}
                getCaptchaButtonText={formatMessage({
                  id: 'user-login.form.get-captcha',
                })}
                getCaptchaSecondText={formatMessage({
                  id: 'user-login.captcha.second',
                })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'user-login.verification-code.required',
                    }),
                  },
                ]}
              />
            </Tab>
          */}

          {/* 忘记密码和自动登录 */}
          {/*
            <div>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                <FormattedMessage id="user-login.login.remember-me" />
              </Checkbox>
              <a
                style={{
                  float: 'right',
                }}
                href=""
              >
                <FormattedMessage id="user-login.login.forgot-password" />
              </a>
            </div>
          */}
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>

          {/* 其他登录方式 */}
          {/*
            <div className={styles.other}>
              <FormattedMessage id="user-login.login.sign-in-with" />
              <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
              <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
              <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
              <Link className={styles.register} to="/user/register">
                <FormattedMessage id="user-login.login.signup" />
              </Link>
            </div>
          */}
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
