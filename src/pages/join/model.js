/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 08:50:27
 * @LastEditTime: 2019-09-23 08:54:15
 * @LastEditors: Please set LastEditors
 */
import {
  getJoinList, addJoin, editJoin, delJoin,
  // getColumnsList,
} from './service';

const joinModel = {
  namespace: 'joinManager',
  state: {
    // 加盟信息列表
    list: [],
    total: 0,
    // cList: [],
  },
  effects: {
    // 获取加盟信息列表
    *fetchJoinList ({ payload }, { call, put }) {
      const response = yield call(getJoinList, payload);
      yield put({
        type: 'queryJoinList',
        payload: response || [],
      });
    },
    // 获取栏目列表
    // *fetchColumnsList ({ payload }, { call, put }) {
    //   const response = yield call(getColumnsList, payload);
    //   yield put({
    //     type: 'queryColumnsList',
    //     payload: response || [],
    //   });
    // },
    // 添加加盟信息
    *addJoin ({ payload, callback }, { call }) {
      const response = yield call(addJoin, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 编辑加盟信息
    *editJoin ({ payload, callback }, { call }) {
      const response = yield call(editJoin, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 删除加盟信息
    *delJoin ({ payload, callback }, { call }) {
      const response = yield call(delJoin, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
  },
  reducers: {
    // 加盟信息列表
    queryJoinList (state, action) {
      const { list, total } = action.payload.data;
      return {
        ...state,
        list,
        total,
      };
    },
    // // 获取栏目列表
    // queryColumnsList (state, action) {
    //   const { data } = action.payload;
    //   return {
    //     ...state,
    //     cList: data,
    //   };
    // },
  },
};
export default joinModel;
