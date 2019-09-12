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

// 数据
@connect(({ bannerManager, loading }) => ({
  bList: bannerManager.bList,
  bTotal: bannerManager.bTotal,
  loading: loading.effects['bannerManager/fetchBannerList'],
}))


class bannerManager extends Component {
  state = {
    // 页码
    page: 1,
    // 条数
    limit: 10,
    // 搜索条件
    query: {
      title: '',
      is_show: '',
      start_time: null,
      end_time: null,
      sTime: '',
      eTime: ''
    },
    showType: ['隐藏', '显示'],
    addModal: false,
    addForm: {
      sort: '',
      title: '',
      img_url: '',
      link: '',
    },
    id:'',
    is_show: '',
    editForm: {
      sort: '',
      title: '',
      img_url: '',
      link: '',
    },
    editModal: false,
  }

  // 页面载入之前(挂载)
  componentDidMount () {
    // 获取列表
    this.getBannerList(1)
  }

  /* 页面渲染--start */
  render () {
    const {
      bList,
      bTotal,
      loading,
    } = this.props;

    const {
      page, limit, query, showType,
      addForm, addModal, id,editForm, editModal,
    } = this.state

    const { getFieldDecorator } = this.props.form;

    // 功能操作菜单
    const menus = (record) => {
      return (
        <Menu onClick={this.changeMenu.bind(this, record)}>
          <Menu.Item  key="1">
            {
              record.is_show === 0 && (
                <a>
                  显示
                </a>
              )
            }
            {
              record.is_show === 1 && (
                <a>
                  隐藏
                </a>
              )
            }
          </Menu.Item>
          <Menu.Item  key="2">
            <a>
              编辑
            </a>
          </Menu.Item>
          <Menu.Item  key="3">
            <a>
              删除
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
              <div className="g-hd">
                {/* 搜索区 */}
                <div className="search" style={{ margin: '30px 10px' }}>
                  <Row gutter={16} type="flex" justify="space-between">
                    <Col>
                      <Form layout="inline">
                        <FormItem label="标题">
                          <Input
                            value={query.title}
                            onChange={(e) => {
                              const { query } = this.state;
                              const { value } = e.target;
                              query.title = value;
                              this.setState({
                                query
                              })
                            }}
                            placeholder="请输入标题" />
                        </FormItem>

                        <FormItem label="是否显示" style={{ marginBottom: '20px' }}>
                          <Select
                            value={query.is_show}
                            style={{ width: 80 }}
                            onChange={(value) => {
                              const { query } = this.state;
                              query.is_show = value
                              this.setState({
                                query
                              })
                            }}>
                            <Option value={1}>显示</Option>
                            <Option value={0}>隐藏</Option>
                          </Select>
                        </FormItem>

                        {/*
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
                        */}

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
                        this.setState({
                          addModal: true
                        })
                      }} >添加Banner</Button>
                    </Col>
                  </Row>
                </div>

              </div>

              {/* 表格 */}
              <Table
                dataSource={bList}
                rowKey="id"
                pagination={false}
                loading={loading}
              >
                <Column title="ID" dataIndex="id" />
                <Column title="排序" dataIndex="sort" />
                <Column title="标题" dataIndex="title" />
                <Column title="图片" dataIndex="img_url" render={(text, record) => (
                  <img src={text} alt="" style={{ width: '200px' }} />
                )} />
                <Column title="链接地址" dataIndex="link" />
                <Column title="是否显示" dataIndex="is_show" render={(text, record) => (
                  <span>
                    {showType[text]}
                  </span>
                )} />
                <Column title="创建时间" dataIndex="create_time" />
                {/* <Column title="更新时间" dataIndex="update_time" /> */}
                {/* <Column title="备注" dataIndex="desc" /> */}

                <Column
                  title="操作"
                  key="options"
                  render={(text, record) => (
                  <Dropdown overlay={menus(record)} placement="bottomLeft">
                    {/* <Button type="link" style={{ padding: 0 }}>查看详情</Button> */}
                    <Button type="primary" icon="setting"></Button>
                  </Dropdown>
                  )}
                />
              </Table>

              {/* 分页 */}
              <Row gutter={16} type="flex" justify="end">
                <Col>
                  <Pagination current={this.state.page} total={bTotal} onChange={this.changePage.bind(this)} style={{ margin: '20px 0' }} />
                </Col>
              </Row>

            </Card>
          </div>

          <Modal
            title="添加Banner"
            visible={addModal}
            onCancel={() => {
              this.setState({
                addModal: false
              })
            }}
            onOk={() => {
              this.addBanner()
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
                })(
                  <Input
                    placeholder="请输入标题"
                    onInput={e => {
                      const { value } = e.target;
                      const { addForm } = this.state;
                      addForm.title = value;
                      this.setState({ addForm });
                    }}
                  />,
                )}
              </FormItem>
              <FormItem label="图片">
                {getFieldDecorator('img_url', {
                  rules: [
                    {
                      required: true,
                      message: '图片地址不能为空',
                    },
                    { min: 10, max: 50, message: '图片地址为10-50个字符' },
                  ],
                })(
                  <Input
                    placeholder="请输入图片地址"
                    onInput={e => {
                      const { value } = e.target;
                      const { addForm } = this.state;
                      addForm.img_url = value;
                      this.setState({ addForm });
                    }}
                  />,
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
                  // 只能输入数字
                  // getValueFromEvent: (event) => {
                  //   return event.target.value.replace(/\D/g, '')
                  // },
                })(
                  <Input
                    placeholder=""
                    onInput={e => {
                      const { value } = e.target;
                      const { addForm } = this.state;
                      addForm.sort = value;
                      this.setState({ addForm });
                    }}
                  />,
                )}
              </FormItem>
            </Form>

          </Modal>

        </Fragment>
      </PageHeaderWrapper>
    );
  }
  /* 页面渲染--end */

  /* 功能函数--sart */
  // 获取Banner列表
  getBannerList (page) {
    // console.log(this.state.query)
    const {
      limit, query, showType
    } = this.state;
    // const { title, is_show, start_time, end_time, sTime, eTime } = this.state.query;
    const { title, is_show } = this.state.query;

    let payload = {
      page: Number(page) || 1,
      title,
      is_show,
      // start_time: sTime || '',
      // end_time: eTime || '',
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'bannerManager/fetchBannerList',
      payload,
    });
  }
  // 添加banner
  addBanner () {
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('表单校验错误');
        return;
      }
      const { sort, title, img_url, link, } = this.state.addForm;

      let payload = {
        title,
        img_url,
        link,
        sort: Number(sort),
      }

      const { dispatch } = this.props;
      dispatch({
        type: 'bannerManager/addBanner',
        payload,
        callback: (res) => {
          message.success(res.msg || '添加成功')
          this.getBannerList(1);
          this.setState({
            addModal: false
          })
        }
      })
    });
  }
  // 编辑banner
  editBanner (id) {
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('表单校验错误');
        return;
      }
      const { sort, title, img_url, link, } = this.state.addForm;

      let payload = {
        id,
        title,
        img_url,
        link,
        sort: Number(sort),
      }

      const { dispatch } = this.props;
      dispatch({
        type: 'bannerManager/editBanner',
        payload,
        callback: (res) => {
          message.success(res.msg || '修改成功')
          this.getBannerList(1);
          this.setState({
            editModal: false
          })
        }
      })
    });
  }
  // 是否显示banner
  editBannerShow (id,is_show) {
    const payload = {
      id,
      is_show,
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'bannerManager/editBannerShow',
      payload,
      callback: (res) => {
        message.success(res.msg || '修改成功')
        this.getBannerList(1);
      }
    })
  }
  // 删除banner
  delBanner (id) {
    const payload = {
      id
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'bannerManager/delBanner',
      payload,
      callback: (res) => {
        message.success(res.msg || '删除成功')
        this.getBannerList(1);
      }
    })
  }

  // 分页功能(监听/排序)
  changePage (page) {
    console.log(page)
    this.setState({
      page
    })
    this.getBannerList(page)
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
    this.getBannerList(1)
  }
  // 重置
  handleQueryReset () {
    // 复位数据
    const queryData = {
      title: '',
      is_show: '',
      // start_time: null,
      // end_time: null,
    }
    this.setState({
      page: 1,
      limit: 10,
      query: queryData
    }, () => {
      this.getBannerList(1)
    })

  }

  // 操作功能
  changeMenu(record,item){
    const { key } = item
    const { id,title } = record

    // // 管理员id
    // this.setState({
    //   id,
    // })
    // const { editForm } = this.state;
    switch (key) {
      // 显示隐藏
      case '1':
        const { is_show } = this.state;
        const isShow = is_show ? 1 : 0;
        this.editBannerShow(id,isShow);
        break;
      // 修改banner
      case '2':
        this.setState({
          editModal: true,
        })
        break;
      // 删除banner
      case '3':
        Modal.confirm({
          title: `删除Banner?`,
          content: `确认删除:${title}吗?`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.delBanner(id)
          },
        });
        break;
      default:
        break;
    }
  }
  /* 功能函数--end */
}

// export default bannerManager;
export default Form.create()(bannerManager);
