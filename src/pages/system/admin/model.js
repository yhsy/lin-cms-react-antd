/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 08:57:22
 * @LastEditTime: 2019-09-25 08:57:22
 * @LastEditors: your name
 */
import {
  getAdminList, addAdmin, editAdmin, delAdmin,
  // getColumnsList,
} from './service';

import { changePassword } from '@/services/admin';

import Md5 from 'md5'


const adminModel = {
  namespace: 'adminManager',
  state: {
    // 管理员列表
    list: [],
    total: 0,
    cList: [],
  },
  effects: {
    // 获取管理员列表
    *fetchAdminList ({ payload }, { call, put }) {
      const response = yield call(getAdminList, payload);
      yield put({
        type: 'queryAdminList',
        payload: response || [],
      });
    },
    // // 获取栏目列表
    // *fetchColumnsList ({ payload }, { call, put }) {
    //   const response = yield call(getColumnsList, payload);
    //   yield put({
    //     type: 'queryColumnsList',
    //     payload: response || [],
    //   });
    // },
    // 添加管理员
    *addAdmin ({ payload, callback }, { call }) {
      const response = yield call(addAdmin, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 管理员修改其他角色账号的密码
    *editPassword ({ payload, callback }, { call }) {
      const { id, password } = payload;
      const req = {
        id: Number(id),
        password: Md5(password),
      }
      const response = yield call(changePassword, req);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 编辑管理员
    *editAdmin ({ payload, callback }, { call }) {
      const response = yield call(editAdmin, payload);
      if (response.code === 0) {
        callback(response)
      }
    },

    // 删除管理员
    *delAdmin ({ payload, callback }, { call }) {
      const response = yield call(delAdmin, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
  },
  reducers: {
    // 管理员列表
    queryAdminList (state, action) {
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
export default adminModel;
