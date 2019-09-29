import React, { Component, Fragment } from 'react';

import { connect } from 'dva';
import moment from 'moment';
import Md5 from 'md5';

import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Pagination,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  Menu,
  Dropdown,
  message,
  Modal,
} from 'antd';

// Antd子组件注册
const FormItem = Form.Item;
const Password = Input.Password;
const { Option } = Select;
const { ColumnGroup, Column } = Table;
const { RangePicker } = DatePicker;

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';

// 数据
@connect(({ adminManager, loading }) => ({
  adminList: adminManager.list,
  total: adminManager.total,
  loading: loading.effects['adminManager/fetchAdminList'],
}))

class adminManager extends Component {
  state = {
    // 管理员状态
    adminStatus: ['冻结', '正常'],
    // 页码
    page: 1,
    // 条数
    limit: 10,
    // 搜索条件
    query: {
      id: '',
      // 状态(1-正常,2-冻结)
      status: '',
      // 用户名
      nickname: '',
      start_time: null,
      end_time: null,
    },
    sTime: '',
    eTime: '',
    addModal: false,
    addForm: {
      username: '',
      password: '',
      group_id: '',
    },
    id: '',
    editForm: {
      password: '',
      status: '',
    },
    editPasswordModal: false,
    eidtStatusModal: false,
    editModal: false,
    editModalTitle: '',
    editModalType: ''
  }

  // 页面载入之前(挂载)
  componentDidMount () {
    // 获取管理员列表
    this.getAdminList(1)
  }

  render () {
    const {
      adminList,
      total,
      loading,
    } = this.props;

    const {
      adminStatus, page, limit, query,
      addModal, addForm,
      auid, editForm, editModal, editModalTitle, editModalType
    } = this.state

    const { getFieldDecorator } = this.props.form;

    // 功能操作菜单
    const menus = (record) => {
      return (
        <Menu onClick={this.changeMenu.bind(this, record)}>
          <Menu.Item key="1">
            <a>
              修改密码
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <a>
              修改状态
            </a>
          </Menu.Item>
          <Menu.Item key="3">
            <a>
              删除管理员
            </a>
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <Card>
              {/* 头部区域 */}
              <div className="g-hd">
                <div className="search" style={{ margin: '30px 10px' }}>
                  <Form layout="inline">
                    <Row gutter={16} type="flex" justify="space-between">
                      <Col>
                        <FormItem label="ID">
                          <Input
                            value={query.id}
                            onChange={(e) => {
                              const { query } = this.state;
                              const { value } = e.target;
                              query.id = value;
                              this.setState({
                                query
                              })
                            }}
                            placeholder="请输入用户ID" />
                        </FormItem>
                        <FormItem label="用户名">
                          <Input
                            value={query.nickname}
                            onChange={(e) => {
                              const { query } = this.state;
                              const { value } = e.target;
                              query.nickname = value;
                              this.setState({
                                query
                              })
                            }}
                            placeholder="请输入用户名" />
                        </FormItem>
                        <FormItem label="状态">
                          <Select value={query.status} style={{ width: 90 }} onChange={(val) => {
                            const { query } = this.state;
                            query.status = val;
                            this.setState({
                              query
                            })
                          }} >
                            <Option value={1}>正常</Option>
                            <Option value={0}>冻结</Option>
                          </Select>
                        </FormItem>
                        <FormItem label="创建时间">
                          <RangePicker
                            format="YYYY-MM-DD"
                            value={[query.start_time, query.end_time]}
                            ranges={{
                              '今天': [moment(), moment()],
                              '最近一个月': [moment().startOf('month'), moment().endOf('month')],
                            }}
                            onChange={this.changeDate.bind(this)}
                          />
                        </FormItem>
                        <FormItem>
                          <Button type="primary" onClick={this.handleQuery.bind(this)} size="large">搜索</Button>
                        </FormItem>
                        <FormItem>
                          <Button onClick={this.handleQueryReset.bind(this)} size="large">重置</Button>
                        </FormItem>
                      </Col>
                      <Col>
                        <Button size="large" type="primary" onClick={() => {
                          // 表单重置
                          this.props.form.setFieldsValue({
                            username: '',
                            password: '',
                          });
                          // 显示弹窗
                          this.setState({
                            addModal: true
                          })
                        }}>添加管理员</Button>
                      </Col>
                    </Row>
                  </Form>
                </div>

              </div>

              {/* 表格 */}
              <Table dataSource={adminList} rowKey="id" pagination={false} loading={loading}>
                <Column title="ID" dataIndex="id" />
                <Column title="用户名" dataIndex="nickname" />
                <Column title="头像" dataIndex="avatar" render={(text, record) => (
                  <img src={text} style={{ width: '30px', height: '30px' }} />
                )} />
                <Column title="状态" dataIndex="active" render={(text, record) => (
                  <span style={text === 0 ? { color: '#ff4d4f' } : { color: '#52C41A' }}>
                    {adminStatus[text]}
                  </span>
                )} />

                <Column title="创建时间" dataIndex="create_time" render={(text, record) => (
                  <span>
                    {moment(text).format('YYYY-MM-DD HH:mm')}
                  </span>
                )} />
                <Column title="更新时间" dataIndex="update_time" render={(text, record) => (
                  <span>
                    {moment(text).format('YYYY-MM-DD HH:mm')}
                  </span>
                )} />
                <Column
                  title="操作"
                  key="options"
                  render={(text, record) => (
                    <Dropdown overlay={menus(record)} placement="bottomLeft">
                      <Button type="primary" icon="setting"></Button>
                    </Dropdown>
                    // <Button type="link" style={{padding: 0}}>查看详情</Button>

                  )}
                />
              </Table>

              {/* 分页 */}
              <Row gutter={16} type="flex" justify="end">
                <Col>
                  <Pagination current={page} pageSize={limit} total={total} onChange={this.changePage.bind(this)} style={{ margin: '20px 0' }} />
                </Col>
              </Row>

            </Card>
          </div>

          {/* 弹窗-添加管理员 */}
          <Modal
            title="添加管理员"
            onCancel={() => {
              this.setState({
                addModal: false,
              })
            }}
            onOk={() => {
              // console.log('添加管理员-确认')
              this.addAdmin()
            }}
            visible={addModal}
          >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
              <FormItem label="角色">
                {getFieldDecorator('cid', {
                  rules: [
                    {
                      required: true,
                      message: '请选择角色',
                    },
                  ],
                  initialValue: addForm.group_id ? addForm.group_id : ''
                })(
                  <Select
                    style={{ width: 130 }}
                    onChange={(value) => {
                      const { addForm } = this.state;
                      addForm.group_id = value;
                      this.setState({ addForm });
                    }}>
                    <Option value={2}>管理员</Option>
                    <Option value={3}>运营</Option>
                    <Option value={4}>客服</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="用户名" >
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: '用户名不能为空',
                    },
                    { min: 5, max: 20, message: '用户名为5-20位' },
                  ],
                })(
                  <Input
                    onChange={(e) => {
                      const { addForm } = this.state;
                      const { value } = e.target;
                      addForm.username = value;
                      this.setState({
                        addForm
                      })
                    }}
                    placeholder="请输入用户名"
                  />,
                )}
              </FormItem>

              <FormItem label="密码" hasFeedback>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码',
                    },
                    { min: 6, max: 20, message: '密码长度为6-20位' },
                  ],
                })(
                  <Password placeholder="请输入密码" onChange={(e) => {
                    const { addForm } = this.state;
                    const { value } = e.target;
                    addForm.password = value;
                    this.setState({
                      addForm
                    })
                  }} />
                )}
              </FormItem>
            </Form>

          </Modal>

          {/* 弹窗-修改管理员 */}
          <Modal
            width="400px"
            // 控制弹窗显示隐藏
            visible={editModal}
            // 弹窗标题
            title={editModalTitle}
            // 点击确定
            onOk={() => {
              this.editAdmin()
            }}
            // 点击取消
            onCancel={() => {
              this.setState({
                editModal: false
              })
            }}
            // 点击遮罩是否允许关闭
            maskClosable={false}
          >
            {/* 修改-备注信息 */}
            {
              editModalType === 'password' && (
                <Password
                  value={editForm.password}
                  placeholder="请输入密码"
                  onChange={(e) => {
                    const { editForm } = this.state;
                    editForm.password = e.target.value;
                    this.setState({
                      editForm
                    })
                  }} />
              )
            }
            {/* 修改-修改状态 */}
            {
              editModalType === 'status' && (
                <Select value={editForm.status} onChange={(val) => {
                  const { editForm } = this.state;
                  editForm.status = val;
                  this.setState({
                    editForm
                  })
                }} style={{ width: 120 }}>
                  <Option value={1}>正常</Option>
                  <Option value={0}>冻结</Option>
                </Select>
              )
            }
          </Modal>

        </Fragment>
      </PageHeaderWrapper>
    );
  }


  // 获取管理员列表
  getAdminList (page) {
    // const {gid,create_time,end_time,page,name,model}
    const { dispatch } = this.props;
    const { limit, sTime, eTime, } = this.state;
    const {
      // role,
      id,
      status,
      nickname,
    } = this.state.query

    const payload = {
      page: Number(page) || 1,
      limit,
      id,
      active: status,
      nickname,
    }

    if (sTime && eTime) {
      payload.startTime = sTime;
      payload.endTime = eTime;
    }

    // 获取游戏列表
    dispatch({
      type: 'adminManager/fetchAdminList',
      payload,
    });
  }
  // 添加管理员
  addAdmin () {
    const { dispatch } = this.props
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('表单校验错误')
        return
      }
      const { username, password, group_id } = this.state.addForm;

      const payload = {
        username,
        password: Md5(password),
        group_id,
      }
      // console.log(`data is ${JSON.stringify(payload)}`)
      dispatch({
        type: 'adminManager/addAdmin',
        payload,
        callback: (res) => {
          this.getAdminList(1);
          this.setState({
            addModal: false
          })
          message.success(res.message || '添加成功')
        }
      });
    })
  }
  // 修改管理员信息
  editAdmin () {
    const { id, editModalType } = this.state;
    const { dispatch } = this.props;

    switch (editModalType) {
      // 修改-密码
      case 'password':
        const { password } = this.state.editForm
        if (password === '') {
          message.error('密码不能为空')
          return
        }

        dispatch({
          type: 'adminManager/editPassword',
          payload: {
            id,
            password,
          },
          // 修改成功回调
          callback: (res) => {
            this.getAdminList(1);
            this.setState({
              editModal: false
            })
            message.success(res.message || '修改成功')
          }
        });
        break;
      // 修改状态
      case 'status':
        const { status } = this.state.editForm
        dispatch({
          type: 'adminManager/editAdminStatus',
          payload: {
            id,
            active: status,
          },
          // 修改成功回调
          callback: (res) => {
            this.getAdminList(1);
            this.setState({
              editModal: false
            })
            message.success(res.message || '修改成功')
          }
        });
        break;
      // 删除
      case 'delete':
        dispatch({
          type: 'adminManager/delAdmin',
          payload: {
            id,
          },
          // 修改成功回调
          callback: (res) => {
            this.getAdminList(1);
            message.success(res.message || '删除成功')
          }
        });
        break;
      default:
        break;
    }
  }
  // 分页功能(监听)
  changePage (page) {
    this.setState({
      page
    })
    // console.log(page)
    this.getAdminList(page)
  }

  // 选择开始时间
  changeDate (dates, dateString) {
    // 对象拷贝
    const queryData = JSON.parse(JSON.stringify(this.state.query))
    // console.log(JSON.stringify(dates))
    // console.log(dateString[0])
    queryData.start_time = dates[0];
    queryData.end_time = dates[1];
    const sTime = dateString[0];
    const eTime = dateString[1]
    // const eTime = moment(dates[1].add(1, 'd')).format('YYYY-MM-DD')

    // const sTime = moment((dateString[0])*1000).format('YYYY-MM-DD')

    // const eTime = moment((dateString[1] + 86400)*1000).format('YYYY-MM-DD');
    // const endTime = moment(dates[1].add(1, 'd')).format('YYYY-MM-DD')
    // console.log(`endTime:${endTime}`)
    // queryData.eTime = endTime;

    this.setState({
      query: queryData,
      sTime,
      eTime,
    })
  }

  // 搜索
  handleQuery () {
    this.setState({
      page: 1
    })
    this.getAdminList(1)
  }
  // 重置
  handleQueryReset () {
    // 复位数据
    const queryData = {
      status: '',
      id: '',
      nickname: '',
      start_time: null,
      end_time: null,
    }
    this.setState({
      page: 1,
      query: queryData,
      sTime: '',
      eTime: '',
    }, () => {
      this.handleQuery()
    })
  }

  // 操作功能
  changeMenu (record, item) {
    const { key } = item
    const { id, status, nickname } = record
    // 管理员id
    this.setState({
      id,
    })
    const { editForm } = this.state;
    switch (key) {
      // 修改密码
      case '1':
        editForm.password = '';

        this.setState({
          editForm,
          editModal: true,
          editModalTitle: '修改密码',
          editModalType: 'password'
        })
        break;
      // 修改状态
      case '2':
        editForm.status = status;
        this.setState({
          editModal: true,
          editModalTitle: '修改状态',
          editModalType: 'status',
          editForm,
        })
        break;
      // 删除管理员
      case '3':
        this.setState({
          editModalType: 'delete',
        })
        Modal.confirm({
          title: `删除管理员?`,
          content: `确认删除-${nickname}吗`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            // console.log('确认删除')
            this.editAdmin()
          },
        });
        break;
      default:
        break;
    }
  }



}

// export default adminManager;
export default Form.create()(adminManager);


