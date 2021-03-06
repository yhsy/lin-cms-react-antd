
import React, { Component, Fragment } from 'react';
/* umi全家桶-start */
import Link from 'umi/link';
// import router from 'umi/router';
// import { routerRedux } from 'dva/router'
import { connect } from 'dva';
/* umi全家桶-end */

/* Antd组件--start */
import {
  Card,
  Row,
  Col,
  List,
  Skeleton,
  Button,
  message,
  Modal,
  Icon,
  Table,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  Descriptions,
  Menu,
  Dropdown,
  Pagination,
  DatePicker,
  Upload,
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

// Antd子组件注册
// const { Step } = Steps;
// const { TabPane } = Tabs;
const { TextArea } = Input;
// const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const FormItem = Form.Item;
const { Option } = Select;
// const CheckboxGroup = Checkbox.Group;
const { ColumnGroup, Column } = Table;
const ButtonGroup = Button.Group
const { RangePicker } = DatePicker;
/* Antd组件--end */
// 日期插件
import moment from 'moment';

import styles from './index.less';

// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

// 获取id和token
import { getUid, getToken } from '@/utils/auth'


// 数据
@connect(({ joinManager, loading }) => ({
  list: joinManager.list,
  total: joinManager.total,
  loading: loading.effects['joinManager/fetchJoinList'],
  // cList: joinManager.cList,
  // cLoading: loading.effects['joinManager/fetchColumnsList'],
}))


class joinManager extends Component {
  state = {
    ctype: 2,
    // 页码
    page: 1,
    // 条数
    limit: 10,
    // 搜索条件
    query: {
      id: '',
      name: '',
      phone: '',
      address: '',
      // desc,
      status: '',
      start_time: null,
      end_time: null,
      sTime: '',
      eTime: ''
    },
    showType: ['隐藏', '显示'],
    // 栏目id对应名称
    columnsType: {
      201: '研发部',
      202: '运营部',
      203: '产品部',
    },
    joinStatus: {
      0: '未查看',
      1: '已查看',
      2: '已回复',
    },
    addModal: false,
    addForm: {
      id: '',
      cid: '',
      title: '',
      num: '',
      // cover: '',
      // url: '',
      // description: '',
      // content: '',
      desc: BraftEditor.createEditorState(''),
      content: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'),
      // editorContent:  BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'),
    },
    modalTitle: '',
    modalType: '',
    id: '',
    status: '',
    editForm: {
      id: '',
      type: '',
      cname: '',
      link: '',
      // sort: '',
      // img_url: '',
    },
    editModal: false,
    // 图片上传loading
    upLoading: false,
    imageUrl: '',
    upHeader: {},
    // 编辑器设置
    editorState: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'), // 设置编辑器初始内容
    // outputHTML: '<p></p>'
  }

  // 页面载入之前(挂载)
  componentDidMount () {
    // 获取列表
    this.getJoinList(1)
    // 获取栏目列表
    // this.getColumnsList();

    // 设置header头
    const { upHeader } = this.state;
    upHeader.id = getUid();
    upHeader.Authorization = 'Bearer ' + getToken()
    this.setState({
      upHeader
    })
  }

  /* 页面渲染--start */
  render () {
    const {
      list,
      total,
      loading,
      // cList,
      // cLoading,
    } = this.props;

    const {
      page, limit, query, showType, columnsType, joinStatus,
      addForm, addModal, modalTitle, modalType,
      id, editForm, editModal,
      upLoading, imageUrl, upHeader,
      editorState, outputHTML,
    } = this.state

    const { getFieldDecorator } = this.props.form;

    // 编辑器组件
    // const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator', 'media' ]


    // 功能操作菜单
    const menus = (record) => {
      return (
        <Menu onClick={this.changeMenu.bind(this, record)}>
          <Menu.Item key="1">
            {
              record.status === 0 && (
                <a>
                  已查看
                </a>
              )
            }
            {
              record.status === 1 && (
                <a>
                  已回复
                </a>
              )
            }
          </Menu.Item>
          <Menu.Item key="2">
            <a>
              修改备注
            </a>
          </Menu.Item>
          <Menu.Item key="3">
            <a>
              删除
            </a>
          </Menu.Item>
        </Menu>
      );
    }



    // 上传按钮
    const uploadButton = (
      <Row gutter={16} type="flex" justify="center" align="middle" style={{ width: '472px', height: '172px' }}>
        <Col>
          <Icon type={upLoading ? 'loading' : 'plus'} />
        </Col>
      </Row>
    );
    // 图片上传之前校验
    function beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('图片上传格式为 JPG/PNG!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过2MB!');
      }
      return isJpgOrPng && isLt2M;
    }


    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <Card>
              <div className="g-hd">
                {/* 搜索区 */}
                <div className="search" style={{ margin: '30px 10px' }}>
                  <Row gutter={16} type="flex" justify="space-between">
                    <Col>
                      <Form layout="inline">
                        {/*
                          <FormItem label="部门" style={{ marginBottom: '20px' }}>
                            <Select
                              value={query.cid}
                              style={{ width: 80 }}
                              onChange={(value) => {
                                const { query } = this.state;
                                query.cid = value
                                this.setState({
                                  query
                                })
                              }}>
                              {
                                cList.map((item, index) => {
                                  return <Option key={item.cid} value={item.cid}>{item.cname}</Option>
                                })
                              }
                            </Select>
                          </FormItem>
                        */}
                        {/* <FormItem label="ID">
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
                            placeholder="请输入ID" />
                        </FormItem> */}
                        <div style={{ marginBottom: '20px' }}>
                          <FormItem label="名称">
                            <Input
                              value={query.name}
                              onChange={(e) => {
                                const { query } = this.state;
                                const { value } = e.target;
                                query.name = value;
                                this.setState({
                                  query
                                })
                              }}
                              placeholder="请输入名称" />
                          </FormItem>
                          <FormItem label="手机">
                            <Input
                              value={query.phone}
                              onChange={(e) => {
                                const { query } = this.state;
                                const { value } = e.target;
                                query.phone = value;
                                this.setState({
                                  query
                                })
                              }}
                              placeholder="请输入手机号" />
                          </FormItem>
                          <FormItem label="状态" style={{ marginBottom: '20px' }}>
                            <Select
                              value={query.status}
                              style={{ width: 80 }}
                              onChange={(value) => {
                                const { query } = this.state;
                                query.status = value
                                this.setState({
                                  query
                                })
                              }}>
                              <Option value={0}>未查看</Option>
                              <Option value={1}>已查看</Option>
                              <Option value={2}>已回复</Option>
                            </Select>
                          </FormItem>
                        </div>

                        <FormItem label="留言时间">
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
                      </Form>
                    </Col>
                    {/* <Col>
                      <Button type="primary" size="large" onClick={() => {
                        // 表单重置
                        this.props.form.resetFields();
                        const addForm = {
                          id: '',
                          cid: '',
                          title: '',
                          num: '',
                          url: '',
                          description: '',
                          cover: '',
                          content: '',
                        }
                        this.setState({
                          addForm,
                          addModal: true,
                          modalTitle: '添加加盟信息',
                          modalType: 'add',
                        })
                      }} >添加加盟信息</Button>
                    </Col> */}
                  </Row>
                </div>

              </div>

              {/* 表格 */}
              <Table
                dataSource={list}
                rowKey="id"
                pagination={false}
                loading={loading}
              >
                <Column title="ID" dataIndex="id" />
                <Column title="名称" dataIndex="name" />
                <Column title="手机" dataIndex="phone" />
                <Column title="地址" dataIndex="address" />

                <Column title="留言内容" dataIndex="note" />

                <Column title="状态" dataIndex="status" render={(text, record) => (
                  <span>
                    {joinStatus[text]}
                  </span>
                )} />
                <Column title="创建时间" dataIndex="created_at" render={(text, record) => (
                  <span>
                    {moment(text).format('YYYY-MM-DD')}
                  </span>
                )} />
                <Column title="更新时间" dataIndex="updated_at" render={(text, record) => (
                  <span>
                    {moment(text).format('YYYY-MM-DD')}
                  </span>
                )} />
                <Column title="备注" dataIndex="desc" render={(text, record) => (
                  <span dangerouslySetInnerHTML={{ __html: text }}>
                    {/* {moment(text).format('YYYY-MM-DD')} */}
                  </span>
                )} />
                <Column
                  title="操作"
                  key="options"
                  render={(text, record) => (
                    // <Button type="link" style={{ padding: 0 }}>查看详情</Button>

                    <Dropdown overlay={menus(record)} placement="bottomLeft">
                      <Button type="primary" icon="setting"></Button>
                    </Dropdown>
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

          <Modal
            title={modalTitle}
            visible={addModal}
            // width="1000px"
            onCancel={() => {
              this.setState({
                addModal: false
              })
            }}
            onOk={() => {
              const { modalType } = this.state;
              if (modalType === 'add') {
                this.addJoin()
              } else {
                const { id } = this.state.addForm;
                this.editJoin(id)
              }
            }}
          >
            {/* <Spin spinning={upLoading}> */}
            <Form>
              {/*
                <FormItem label="所属部门">
                  {getFieldDecorator('cid', {
                    rules: [
                      {
                        required: true,
                        message: '请选择部门',
                      },
                    ],
                    initialValue: addForm.cid ? addForm.cid : ''
                  })(
                    <Select
                      style={{ width: 130 }}
                      onChange={(value) => {
                        const { addForm } = this.state;
                        addForm.cid = value;
                        this.setState({ addForm });
                      }}>
                      {
                        cList.map((item, index) => {
                          return <Option key={item.cid} value={item.cid}>{item.cname}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              */}
              {/* 
                <FormItem label="职位名称">
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: '职位名称不能为空',
                      },
                      { min: 2, max: 30, message: '职位名称为2-30个字符' },
                    ],
                    initialValue: addForm.title ? addForm.title : ''
                  })(
                    <Input
                      placeholder="请输入职位名称"
                      onInput={e => {
                        const { value } = e.target;
                        const { addForm } = this.state;
                        addForm.title = value;
                        this.setState({ addForm });
                      }}
                    />,
                  )}
                </FormItem>
                <FormItem label="加盟人数">
                  {getFieldDecorator('num', {
                    rules: [
                      {
                        required: true,
                        message: '加盟人数不能为空',
                      },
                    ],
                    initialValue: addForm.num ? addForm.num : ''
                  })(
                    <Input
                      placeholder="请输入加盟人数"
                      onInput={e => {
                        const { value } = e.target;
                        const { addForm } = this.state;
                        addForm.num = value;
                        this.setState({ addForm });
                      }}
                    />,
                  )}
                </FormItem>
                <FormItem label="加盟要求">
                  {getFieldDecorator('content', {
                    rules: [
                      {
                        required: true,
                        message: '内容不能为空',
                      },
                    ],
                    initialValue: addForm.content ? BraftEditor.createEditorState(addForm.content) : BraftEditor.createEditorState('')
                  })(
                    <BraftEditor
                      // value={editorState}
                      className={styles.my_editor}
                      // controls={controls}
                      placeholder="请输入加盟要求"
                      onChange={(editorState) => {
                        const { addForm } = this.state;
                        addForm.content = editorState.toHTML();

                        this.setState({
                          addForm,
                        })
                      }}
                    />
                  )}
                </FormItem> 
              */}
              <FormItem label="备注信息">
                {getFieldDecorator('desc', {
                  rules: [
                    {
                      required: true,
                      message: '备注信息不能为空',
                    },
                  ],
                  initialValue: addForm.desc ? BraftEditor.createEditorState(addForm.desc) : BraftEditor.createEditorState('')
                })(
                  <BraftEditor
                    // value={editorState}
                    className={styles.my_editor}
                    // controls={controls}
                    placeholder="请输入加盟要求"
                    onChange={(editorState) => {
                      const { addForm } = this.state;
                      addForm.desc = editorState.toHTML();

                      this.setState({
                        addForm,
                      })
                    }}
                  />
                )}
              </FormItem>
            </Form>
            {/* </Spin> */}

          </Modal>

        </Fragment>
      </PageHeaderWrapper >
    );
  }
  /* 页面渲染--end */

  /* 功能函数--sart */
  // 获取Join列表
  getJoinList (page) {
    // console.log(this.state.query)
    const {
      limit, query,
    } = this.state;

    const {
      name,
      phone,
      // address,
      // desc,
      status,
      start_time,
      end_time,
      sTime,
      eTime,
    } = this.state.query

    let payload = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      name,
      phone,
      // address,
      // desc,
      status,
      startTime: sTime || '',
      endTime: eTime || '',
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'joinManager/fetchJoinList',
      payload,
    });
  }
  // // 获取栏目列表
  // getColumnsList () {
  //   const {
  //     ctype
  //   } = this.state;

  //   let payload = {
  //     type: ctype,
  //   }

  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'joinManager/fetchColumnsList',
  //     payload,
  //   });
  // }
  // 添加加盟
  addJoin () {
    this.props.form.validateFields((err, values) => {
      // console.log(err, values)
      if (err) {
        console.log('表单校验错误');
        return;
      }
      const {
        cid,
        title,
        num,
        // cover,
        // url,
        // description,
        content,
      } = this.state.addForm;


      let payload = {
        cid,
        title,
        num: Number(num),
        // cover,
        // url,
        // description,
        content,
      }

      const { dispatch } = this.props;
      dispatch({
        type: 'joinManager/addJoin',
        payload,
        callback: (res) => {
          message.success(res.msg || '添加成功')
          this.getJoinList(1);
          this.setState({
            addModal: false
          })
        }
      })
    });
  }
  // 编辑加盟
  editJoin (id) {
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('表单校验错误');
        return;
      }
      const {
        id,
        // cid,
        // title,
        // num,
        // cover,
        // url,
        desc,
        // content,
      } = this.state.addForm;

      let payload = {
        id,
        // cid,
        // title,
        // num,
        // cover,
        // url,
        desc,
        // content,
      }

      const { dispatch } = this.props;
      dispatch({
        type: 'joinManager/editJoin',
        payload,
        callback: (res) => {
          message.success(res.msg || '修改成功')
          this.getJoinList(1);
          this.setState({
            addModal: false
          })
        }
      })
    });
  }
  // 是否显示加盟
  editJoinShow (id, status) {
    // console.log(id,status);
    const payload = {
      id,
      status,
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'joinManager/editJoin',
      payload,
      callback: (res) => {
        message.success(res.msg || '修改成功')
        this.getJoinList(1);
      }
    })
  }
  // 删除加盟
  delJoin (id) {
    const payload = {
      id
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'joinManager/delJoin',
      payload,
      callback: (res) => {
        message.success(res.msg || '删除成功')
        this.getJoinList(1);
      }
    })
  }

  // 分页功能(监听/排序)
  changePage (page) {
    this.setState({
      page
    })
    this.getJoinList(page)
  }
  // 选择开始时间
  changeDate (dates, dateString) {
    // 对象拷贝
    const queryData = JSON.parse(JSON.stringify(this.state.query))
    // console.log(JSON.stringify(dates))
    // console.log(dateString[0])
    queryData.start_time = dates[0];
    queryData.end_time = dates[1]
    queryData.sTime = dateString[0]

    queryData.eTime = dateString[1]
    // const endTime = moment(dates[1].add(1, 'd')).format('YYYY-MM-DD')
    // console.log(`endTime:${endTime}`)
    // queryData.eTime = endTime;


    this.setState({
      query: queryData
    })
  }
  // 搜索
  handleQuery () {

    const { query } = this.state;

    this.setState({
      page: 1
    })
    this.getJoinList(1)
  }
  // 重置
  handleQueryReset () {
    // 复位数据
    const queryData = {
      title: '',
      status: '',
      // start_time: null,
      // end_time: null,
    }
    this.setState({
      page: 1,
      limit: 10,
      query: queryData
    }, () => {
      this.getJoinList(1)
    })

  }

  // 操作功能
  changeMenu (record, item) {
    const { key } = item
    // const { id } = record
    // console.log(`id:${id}`)

    switch (key) {
      // 显示隐藏
      case '1':
        const isShow = record.status;
        const showStatus = isShow ? 2 : 1;
        this.editJoinShow(record.id, showStatus);
        break;
      // 修改加盟
      case '2':
        const {
          id,
          // cid,
          // title,
          // num,
          // cover,
          // url,
          desc,
          // content,
        } = record;

        const addForm = {
          id,
          // cid,
          // title,
          // num,
          // cover,
          // url,
          desc,
          // content,
        }
        this.setState({
          addForm,
          addModal: true,
          modalTitle: '修改备注',
          modalType: 'edit',
        })
        break;
      // 删除加盟
      case '3':
        const bTitle = record.name;

        Modal.confirm({
          title: `删除加盟?`,
          content: `客户名:${bTitle}吗?`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.delJoin(record.id)
          },
        });
        break;
      default:
        break;
    }
  }

  // 图片转成Base64格式
  getBase64 (img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  // 图片上传
  UploadImgChange = info => {
    // 上传中
    if (info.file.status === 'uploading') {
      this.setState({ upLoading: true });
      return;
    }
    // 上传成功回调
    if (info.file.status === 'done') {
      console.log(info.file)
      // console.log()
      // 服务端返回的数据
      const { response } = info.file;
      const { addForm } = this.state;
      if (response.code === 0) {
        const { img_url } = response.data;
        addForm.cover = img_url;
        // console.log(`addForm is ${JSON.stringify(addForm)}`)

        this.setState({
          // imageUrl: img_url,
          addForm,
          upLoading: false,
        })

        // addForm.img_url = img_url
        // this.setState({
        //   addForm,
        //   upLoading: false,
        // })
      } else {
        message.error(response.msg || '上传失败')
      }

      // Get this url from response in real world.
      // 本地预览(本地图片转成Base64)
      // this.getBase64(info.file.originFileObj, imageUrl =>
      //   this.setState({
      //     imageUrl,
      //     upLoading: false,
      //   }),
      // );
    }
  };

  // 图片上传
  UploadImgEditChange = info => {
    // 上传中
    if (info.file.status === 'uploading') {
      this.setState({ upLoading: true });
      return;
    }
    // 上传成功回调
    if (info.file.status === 'done') {
      // console.log(info.file)
      // console.log()
      // 服务端返回的数据
      const { response } = info.file;
      const { editForm } = this.state;
      if (response.code === 0) {
        const { img_url } = response.data;
        editForm.img_url = img_url;

        this.setState({
          editForm,
          upLoading: false,
        })

      } else {
        message.error(response.msg || '上传失败')
      }

      // Get this url from response in real world.
      // 本地预览(本地图片转成Base64)
      // this.getBase64(info.file.originFileObj, imageUrl =>
      //   this.setState({
      //     imageUrl,
      //     upLoading: false,
      //   }),
      // );
    }
  };
  /* 功能函数--end */
}

export default Form.create()(joinManager);
