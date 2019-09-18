/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-18 08:46:14
 * @LastEditTime: 2019-09-18 08:46:14
 * @LastEditors: your name
 */
import {
  getArticleList, addArticle, editArticle, delArticle,
} from './service';

const articleModel = {
  namespace: 'articleManager',
  state: {
    // 文章列表
    list: [],
    total: 0,
  },
  effects: {
    // 获取文章列表
    *fetchArticleList ({ payload }, { call, put }) {
      const response = yield call(getArticleList, payload);
      yield put({
        type: 'queryArticleList',
        payload: response || [],
      });
    },
    // 添加文章
    *addArticle ({ payload, callback }, { call }) {
      const response = yield call(addArticle, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 编辑文章
    *editArticle ({ payload, callback }, { call }) {
      const response = yield call(editArticle, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 删除文章
    *delArticle ({ payload, callback }, { call }) {
      const response = yield call(delArticle, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
  },
  reducers: {
    // 文章列表
    queryArticleList (state, action) {
      const { list, total } = action.payload.data;
      return {
        ...state,
        list,
        total,
      };
    },
  },
};
export default articleModel;
