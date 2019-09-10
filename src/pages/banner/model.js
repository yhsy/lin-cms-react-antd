import {
  getBannerList
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
      console.log(`payload is ${JSON.stringify(payload)}`)
      const response = yield call(getBannerList, payload);
      // console.log(JSON.stringify(response))
      yield put({
        type: 'queryBannerList',
        payload: response || [],
      });
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