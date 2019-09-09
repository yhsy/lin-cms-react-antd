
import { FormattedMessage } from 'umi-plugin-react/locale';
import React, { Fragment } from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
// import AdminModel from '@/models/admin';
import { getUid } from '@/utils/auth'

import {
  Avatar, Icon, Menu, Spin, Row, Col,
  Modal, Button, message, Form, Input,
} from 'antd';

const FormItem = Form.Item


// 去掉实施校验
import Schema from 'async-validator'
Schema.warning = () => { };


@connect(({ admin }) => ({
  // console.log(`user is ${JSON.stringify(user)}`)
  userInfo: admin.userInfo,
}))
class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;
    // 退出登录
    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'admin/loginOut',
        });
      }

      return;
    }
    // 修改密码
    if (key === 'changePassword') {
      // console.log('修改密码')
      // 表单重置(移除校验结果)
      this.props.form.resetFields();
      // 显示修改密码弹窗
      this.setState({
        pwdModal: true
      })
      return;
    }

    router.push(`/account/${key}`);
  };

  constructor(props) {
    super(props);
    // console.log(this.props)
    this.state = {
      pwdModal: false,
      // 管理员ID
      id: '',
      // 旧密码
      oldPassword: '',
      // 新密码
      newPassword: '',
      // 确认新密码
      confirmPassword: '',
      confirmDirty: false,
    }
  }


  render () {
    // const {
    //   userInfo = {
    //     avatar: '',
    //     id: '',
    //     nickname: '',
    //   },
    //   menu,
    // } = this.props;

    const { userInfo = {}, menu } = this.props;

    const { pwdModal, id, oldPassword, newPassword, confirmPassword } = this.state

    const { getFieldDecorator } = this.props.form;
    // 头像-下拉菜单
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {/* 修改密码 */}
        <Menu.Item key="changePassword">
          <Icon type="setting" />
          <FormattedMessage id="menu.changePassword" defaultMessage="changePassword" />
        </Menu.Item>
        <Menu.Divider />
        {/* 退出登录 */}
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return userInfo && userInfo.nickname ? (
      <Fragment>

        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar size="small" className={styles.avatar} src={userInfo.avatar} alt="avatar" />
            <span className={userInfo.nickname}>{userInfo.nickname}</span>
          </span>
        </HeaderDropdown>
        <Modal
          // 弹窗是否垂直居中
          // centered={true}
          width="400px"
          title="修改密码"
          // 控制弹窗显示隐藏
          visible={pwdModal}
          // 点击确认
          onOk={() => {
            // console.log('onOk')
            this.handleSubmit()
          }}
          // 点击取消
          onCancel={() => {
            this.setState({
              pwdModal: false,
              oldPassword: '',
              newPassword: '',
              confrimPassword: ''
            })
          }}
          // 点击遮罩是否允许关闭
          maskClosable={false}
        >
          <Form>
            <FormItem label="旧密码" hasFeedback>
              {getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true,
                    message: '请输入旧密码',
                  },
                  { min: 5, max: 20, message: '密码长度为5-20位' },
                ],
              })(<Input.Password onInput={(e) => { this.setState({ oldPassword: e.target.value }) }} />)}
            </FormItem>
            <Form.Item label="新密码" hasFeedback>
              {getFieldDecorator('newPassword', {
                rules: [
                  {
                    required: true,
                    message: '请输入新密码',
                  },
                  { min: 5, max: 20, message: '密码长度为5-20位' },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password onInput={(e) => { this.setState({ newPassword: e.target.value }) }} />)}
            </Form.Item>
            <Form.Item label="确认新密码" hasFeedback>
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    message: '请确认新密码',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password onBlur={this.handleConfirmBlur} onInput={(e) => { this.setState({ confirmPassword: e.target.value }) }} />)}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>

    ) : (
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      );
  }


  // 密码校验规则
  // 新密码校验规则
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };
  // 确认新密码校验规则
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次密码输入不一致');
    } else {
      callback();
    }
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  // 提交
  handleSubmit = () => {
    // 表单整体校验
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('表单校验错误')
        return
      }
      const { oldPassword, newPassword } = this.state
      const { dispatch } = this.props
      dispatch({
        type: 'admin/changePassword',
        payload: {
          id: getUid(),
          oldPassword,
          newPassword,
        },
        // 修改成功回调
        callback: (res) => {
          this.setState({
            pwdModal: false
          })
          message.success(res.message || '修改成功,请重新登录')
        }
      });
    });

  };
}


export default Form.create()(AvatarDropdown);

