/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-12 08:36:39
 * @LastEditTime: 2019-09-12 09:31:32
 * @LastEditors: Please set LastEditors
 */
import {
  getBannerList, addBanner, editBanner, editBannerShow, delBanner,
} from './service';

const bannerModel = {
  namespace: 'bannerManager',
  state: {
    // Banner-列表
    bList: [],
    bTotal: 0,
  },
  effects: {
    // 获取-Banner列表
    *fetchBannerList ({ payload }, { call, put }) {
      const response = yield call(getBannerList, payload);
      // console.log(JSON.stringify(response))
      yield put({
        type: 'queryBannerList',
        payload: response || [],
      });
    },
    // 添加banner
    *addBanner ({ payload, callback }, { call }) {
      const response = yield call(addBanner, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 编辑banner
    *editBanner ({ payload, callback }, { call }) {
      const response = yield call(editBanner, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 显示隐藏banner
    *editBannerShow ({ payload, callback }, { call }) {
      const response = yield call(editBannerShow, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
    // 删除banner
    *delBanner ({ payload, callback }, { call }) {
      const response = yield call(delBanner, payload);
      if (response.code === 0) {
        callback(response)
      }
    },
  },
  reducers: {
    // Banner列表
    queryBannerList (state, action) {
      const { list, total } = action.payload.data;
      return {
        ...state,
        bList: list,
        bTotal: total,
      };
    },
  },
};
export default bannerModel;
