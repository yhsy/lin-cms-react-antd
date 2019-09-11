import {
  getBannerList, addBanner,
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
    }
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