import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

import { loginPwd } from '@/services/admin';
import { message } from 'antd';

import Md5 from 'md5'

const AdminModel = {
  namespace: 'admin',
  state: {
    currentUser: {},
  },
  effects: {
    *loginPwd ({ payload }, { call, put }) {
      const data = {
        username: payload.userName,
        password: Md5(payload.password)
      }
      const response = yield call(loginPwd, data);
      if (response.code !== 0) {
        message.error(response.msg)
        return
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      }
    },

  },
  reducers: {
    changeLoginStatus (state, { payload }) {
      setAuthority('admin');
      return { ...state, status: 'ok', type: 'account' };
      // return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default AdminModel;
