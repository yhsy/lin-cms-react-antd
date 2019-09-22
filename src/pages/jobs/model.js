import {
  getJobsList, addJobs, editJobs, delJobs,
  getColumnsList,
} from './service';

const jobsModel = {
  namespace: 'jobsManager',
  state: {
    // 招聘信息列表
    list: [],
    total: 0,
    cList: [],
  },
  effects: {
    // 获取招聘信息列表
    *fetchJobsList ({ payload }, { call, put }) {
      const response = yield call(getJobsList, payload);
      yield put({
        type: 'queryJobsList',
        payload: response || [],
      });
    },
    // 获取栏目列表
    *fetchColumnsList ({ payload }, { call, put }) {
      const response = yield call(getColumnsList, payload);
      yield put({
        type: 'queryColumnsList',
        payload: response || [],
      });
    },
    // 添加招聘信息
    *addJobs ({ payload, callback }, { call }) {
      const response = yield call(addJobs, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 编辑招聘信息
    *editJobs ({ payload, callback }, { call }) {
      const response = yield call(editJobs, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 删除招聘信息
    *delJobs ({ payload, callback }, { call }) {
      const response = yield call(delJobs, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
  },
  reducers: {
    // 招聘信息列表
    queryJobsList (state, action) {
      const { list, total } = action.payload.data;
      return {
        ...state,
        list,
        total,
      };
    },
    // 获取栏目列表
    queryColumnsList (state, action) {
      const { data } = action.payload;
      return {
        ...state,
        cList: data,
      };
    },
  },
};
export default jobsModel;
