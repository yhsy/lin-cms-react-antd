import {
  getColumnsList, addColumns, editColumns, delColumns,
} from './service';

const columnsModel = {
  namespace: 'columnsManager',
  state: {
    // 栏目列表
    list: [],
    total: 0,
  },
  effects: {
    // 获取栏目列表
    *fetchColumnsList ({ payload }, { call, put }) {
      const response = yield call(getColumnsList, payload);
      yield put({
        type: 'queryColumnsList',
        payload: response || [],
      });
    },
    // 添加栏目
    *addColumns ({ payload, callback }, { call }) {
      const response = yield call(addColumns, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 编辑栏目
    *editColumns ({ payload, callback }, { call }) {
      const response = yield call(editColumns, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 删除栏目
    *delColumns ({ payload, callback }, { call }) {
      const response = yield call(delColumns, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
  },
  reducers: {
    // 栏目列表
    queryColumnsList (state, action) {
      const { list, total } = action.payload.data;
      return {
        ...state,
        list,
        total,
      };
    },
  },
};
export default columnsModel;
