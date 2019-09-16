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
// const { TextArea } = Input;
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
// import gameImg from 'assets/game_1.jpg';
import styles from './index.less';

// 获取id和token
import { getUid, getToken } from '@/utils/auth'


// 数据
@connect(({ columnsManager, loading }) => ({
  list: columnsManager.list,
  total: columnsManager.total,
  loading: loading.effects['columnsManager/fetchColumnsList'],
}))


class columnsManager extends Component {
  state = {
    // 页码
    page: 1,
    // 条数
    limit: 10,
    // 搜索条件
    query: {
      title: '',
      status: '',
      start_time: null,
      end_time: null,
      sTime: '',
      eTime: ''
    },
    showType: ['隐藏', '显示'],
    addModal: false,
    addForm: {
      type: '',
      cname: '',
      link: '',
      sort: '',
      img_url: '',
    },
    id: '',
    status: '',
    editForm: {
      sort: '',
      title: '',
      img_url: '',
      link: '',
      status: '',
    },
    editModal: false,
    upLoading: false,
    imageUrl: '',
    upHeader: {}
  }

  // 页面载入之前(挂载)
  componentDidMount () {
    // 获取列表
    this.getColumnsList(1)

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
    } = this.props;

    const {
      page, limit, query, showType,
      addForm, addModal, id, editForm, editModal,
      upLoading, imageUrl, upHeader,
    } = this.state

    const { getFieldDecorator } = this.props.form;

    // 功能操作菜单
    const menus = (record) => {
      return (
        <Menu onClick={this.changeMenu.bind(this, record)}>
          <Menu.Item key="1">
            {
              record.status === 0 && (
                <a>
                  显示
                </a>
              )
            }
            {
              record.status === 1 && (
                <a>
                  隐藏
                </a>
              )
            }
          </Menu.Item>
          <Menu.Item key="2">
            <a>
              编辑
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
                        <FormItem label="标题">
                          <Input
                            value={query.cname}
                            onChange={(e) => {
                              const { query } = this.state;
                              const { value } = e.target;
                              query.cname = value;
                              this.setState({
                                query
                              })
                            }}
                            placeholder="请输入标题" />
                        </FormItem>

                        <FormItem label="是否显示" style={{ marginBottom: '20px' }}>
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
                            <Option value={1}>显示</Option>
                            <Option value={0}>隐藏</Option>
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
                      </Form>
                    </Col>
                    <Col>
                      <Button type="primary" onClick={() => {
                        // 表单重置
                        this.props.form.resetFields();
                        this.setState({
                          addModal: true
                        })
                      }} >添加栏目</Button>
                    </Col>
                  </Row>
                </div>

              </div>

              {/* 表格 */}
              <Table
                dataSource={list}
                rowKey="cid"
                pagination={false}
                loading={loading}
              >
                <Column title="ID" dataIndex="cid" />
                {/* <Column title="排序" dataIndex="sort" /> */}
                <Column title="标题" dataIndex="cname" />
                <Column title="链接地址" dataIndex="link" />
                <Column title="是否显示" dataIndex="status" render={(text, record) => (
                  <span>
                    {showType[text]}
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

                <Column
                  title="操作"
                  key="options"
                  render={(text, record) => (
                    <Button type="link" style={{ padding: 0 }}>查看详情</Button>

                    // <Dropdown overlay={menus(record)} placement="bottomLeft">
                    //   <Button type="primary" icon="setting"></Button>
                    // </Dropdown>
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
            title="添加栏目"
            visible={addModal}
            onCancel={() => {
              this.setState({
                addModal: false
              })
            }}
            onOk={() => {
              this.addColumns()
            }}
          >
            {/* <Spin spinning={upLoading}> */}
            <Form>
              <FormItem label="栏目类型">
                {getFieldDecorator('type', {
                  rules: [
                    {
                      required: true,
                      message: '请选择栏目类型',
                    },
                  ],
                })(
                  <Select
                    style={{ width: 130 }}
                    onChange={(value) => {
                      const { addForm } = this.state;
                      addForm.type = value;
                      this.setState({ addForm });
                    }}>
                    <Option value={1}>新闻资讯</Option>
                    <Option value={2}>人才招聘</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="栏目名称">
                {getFieldDecorator('cname', {
                  rules: [
                    {
                      required: true,
                      message: '标题不能为空',
                    },
                    { min: 2, max: 20, message: '标题名称为2-20个字符' },
                  ],
                })(
                  <Input
                    placeholder="请输入栏目名称"
                    onInput={e => {
                      const { value } = e.target;
                      const { addForm } = this.state;
                      addForm.cname = value;
                      this.setState({ addForm });
                    }}
                  />,
                )}
              </FormItem>

              {/*
                <FormItem label="图片地址">
                  {getFieldDecorator('img_url', {
                    rules: [
                      {
                        required: true,
                        message: '图片地址不能为空',
                      },
                    ],
                  })(
                    <Upload
                      // name='file'
                      name="avatar"
                      listType="picture-card"
                      style={{
                        width: '472px',
                        height: '172px'
                      }}
                      // className="avatar-uploader"
                      showUploadList={false}
                      // 请求头一定要带上(id和token)
                      headers={upHeader}
                      action="/api/upload/qiniu_img"
                      beforeUpload={beforeUpload}
                      onChange={this.UploadImgChange}
                    >
                      {this.state.addForm.img_url ? <img src={this.state.addForm.img_url} alt="avatar" style={{
                        width: '472px',
                        height: '172px'
                      }} /> : uploadButton}
                    </Upload>
                  )}
                </FormItem>
              */}
              <FormItem label="链接地址">
                {getFieldDecorator('link', {
                  rules: [
                    {
                      required: true,
                      message: '链接不能为空',
                    },
                    { min: 1, max: 50, message: '链接地址为1-50个字符' },
                  ],
                })(
                  <Input
                    placeholder="请输入链接地址"
                    onInput={e => {
                      const { value } = e.target;
                      const { addForm } = this.state;
                      addForm.link = value;
                      this.setState({ addForm });
                    }}
                  />,
                )}
              </FormItem>
            </Form>
            {/* </Spin> */}

          </Modal>

          {/* <Modal
            title="编辑栏目"
            visible={editModal}
            onCancel={() => {
              this.setState({
                editModal: false
              })
            }}
            onOk={() => {
              const { id } = this.state.editForm;
              this.editColumns(id)
            }}
          >
            <Form>
              <FormItem label="标题">
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '标题不能为空',
                    },
                    { min: 2, max: 20, message: '标题名称为2-20个字符' },
                  ],
                  initialValue: editForm.title ? editForm.title : ''
                })(
                  <Input
                    placeholder="请输入标题"
                    onInput={e => {
                      const { value } = e.target;
                      const { editForm } = this.state;
                      editForm.title = value;
                      this.setState({ editForm });
                    }}
                  />,
                )}
              </FormItem>
              <FormItem label="图片地址">
                {getFieldDecorator('img_url', {
                  rules: [
                    {
                      required: true,
                      message: '图片地址不能为空',
                    },
                  ],
                  // initialValue: editForm.img_url ? editForm.img_url : ''
                })(
                  <Upload
                    // name='file'
                    name="avatar"
                    listType="picture-card"
                    style={{
                      width: '472px',
                      height: '172px'
                    }}
                    // className="avatar-uploader"
                    showUploadList={false}
                    // 请求头一定要带上(id和token)
                    headers={upHeader}
                    action="/api/upload/qiniu_img"
                    beforeUpload={beforeUpload}
                    onChange={this.UploadImgEditChange}
                  >
                    {this.state.editForm.img_url ? <img src={this.state.editForm.img_url} alt="avatar" style={{
                      width: '472px',
                      height: '172px'
                    }} /> : uploadButton}
                  </Upload>
                )}
              </FormItem>
              <FormItem label="链接地址">
                {getFieldDecorator('link', {
                  rules: [
                    {
                      required: true,
                      message: '链接不能为空',
                    },
                    { min: 1, max: 50, message: '链接地址为1-50个字符' },
                  ],
                  initialValue: editForm.link ? editForm.link : ''
                })(
                  <Input
                    placeholder="请输入链接地址"
                    onInput={e => {
                      const { value } = e.target;
                      const { editForm } = this.state;
                      editForm.link = value;
                      this.setState({ editForm });
                    }}
                  />,
                )}
              </FormItem>
              <FormItem label="排序">
                {getFieldDecorator('sort', {
                  rules: [
                    {
                      required: true,
                      message: '排序不能为空',
                    },
                    {
                      pattern: new RegExp(/^[1-9]\d*$/, "g"),
                      message: '请输入正确的排序'
                    }
                  ],
                  initialValue: editForm.sort ? editForm.sort : ''
                })(
                  <Input
                    placeholder=""
                    onInput={e => {
                      const { value } = e.target;
                      const { editForm } = this.state;
                      editForm.sort = value;
                      this.setState({ editForm });
                    }}
                  />,
                )}
              </FormItem>
              <FormItem label="是否显示">
                {getFieldDecorator('status', {
                  rules: [
                    {
                      required: true,
                      message: '请选择是否显示',
                    },
                  ],
                  initialValue: editForm.status ? 1 : 0
                })(
                  <Select
                    style={{ width: 80 }}
                    onChange={(value) => {
                      const { editForm } = this.state;
                      editForm.status = value;
                      this.setState({ editForm });
                    }}>
                    <Option value={1}>显示</Option>
                    <Option value={0}>隐藏</Option>
                  </Select>
                )}
              </FormItem>
            </Form>

          </Modal> */}

        </Fragment>
      </PageHeaderWrapper >
    );
  }
  /* 页面渲染--end */

  /* 功能函数--sart */
  // 获取Columns列表
  getColumnsList (page) {
    // console.log(this.state.query)
    const {
      limit, query, showType
    } = this.state;
    const {
      cname, status, start_time, end_time, sTime, eTime
    } = this.state.query;

    let payload = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      cname,
      status,
      startTime: sTime || '',
      endTime: eTime || '',
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'columnsManager/fetchColumnsList',
      payload,
    });
  }
  // 添加banner
  addColumns () {
    this.props.form.validateFields((err, values) => {
      // console.log(err, values)
      if (err) {
        console.log('表单校验错误');
        return;
      }
      const { type,cname, link, } = this.state.addForm;


      let payload = {
        type,
        cname,
        link,
      }

      const { dispatch } = this.props;
      dispatch({
        type: 'columnsManager/addColumns',
        payload,
        callback: (res) => {
          message.success(res.msg || '添加成功')
          this.getColumnsList(1);
          this.setState({
            addModal: false
          })
        }
      })
    });
  }
  // 编辑banner
  editColumns (id) {
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('表单校验错误');
        return;
      }
      const { sort, title, img_url, link, status, } = this.state.editForm;

      let payload = {
        id,
        title,
        img_url,
        link,
        sort: Number(sort),
        status,
      }

      const { dispatch } = this.props;
      dispatch({
        type: 'columnsManager/editColumns',
        payload,
        callback: (res) => {
          message.success(res.msg || '修改成功')
          this.getColumnsList(1);
          this.setState({
            editModal: false
          })
        }
      })
    });
  }
  // 是否显示banner
  editColumnsShow (id, status) {
    const payload = {
      id,
      status,
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'columnsManager/editColumnsShow',
      payload,
      callback: (res) => {
        message.success(res.msg || '修改成功')
        this.getColumnsList(1);
      }
    })
  }
  // 删除banner
  delColumns (id) {
    const payload = {
      id
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'columnsManager/delColumns',
      payload,
      callback: (res) => {
        message.success(res.msg || '删除成功')
        this.getColumnsList(1);
      }
    })
  }

  // 分页功能(监听/排序)
  changePage (page) {
    this.setState({
      page
    })
    this.getColumnsList(page)
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


    this.setState({
      query: queryData
    })
  }
  // 搜索
  handleQuery () {
    // 使用次数要成对出现
    const { query } = this.state;

    this.setState({
      page: 1
    })
    this.getColumnsList(1)
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
      this.getColumnsList(1)
    })

  }

  // 操作功能
  changeMenu (record, item) {
    const { key } = item
    const { id } = record

    switch (key) {
      // 显示隐藏
      case '1':
        const isShow = record.status;
        const showStatus = isShow ? 0 : 1;
        this.editColumnsShow(id, showStatus);
        break;
      // 修改banner
      case '2':
        const { title, img_url, link, sort, status, } = record;
        const editForm = {
          id, title, img_url, link, sort, status,
        }
        this.setState({
          editForm,
          editModal: true,
        })
        break;
      // 删除banner
      case '3':
        const bTitle = record.title;

        Modal.confirm({
          title: `删除栏目?`,
          content: `确认删除:${bTitle}吗?`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.delColumns(id)
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
        addForm.img_url = img_url;
        // console.log(`addForm is ${JSON.stringify(addForm)}`)

        this.setState({
          imageUrl: img_url,
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

// export default columnsManager;
export default Form.create()(columnsManager);
