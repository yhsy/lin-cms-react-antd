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
    showType: ['隐藏', '显示']
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
      page, limit, query, showType
    } = this.state

    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <Card>
              <div className="g-hd">
                {/* 搜索区 */}
                <div className="search" style={{ margin: '30px 10px' }}>
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
                    <Button type="link" style={{ padding: 0 }}>查看详情</Button>
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

        </Fragment>
      </PageHeaderWrapper>
    );
  }
  /* 页面渲染--end */

  /* 功能函数--sart */
  // 获取战绩列表
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
  /* 功能函数--end */
}

export default bannerManager;