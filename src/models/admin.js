import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

import { loginPwd } from '@/services/admin';
import { message } from 'antd';

import Md5 from 'md5'
// Token和Uid存储
import { setToken, setUid } from '../utils/auth'

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
      // 判断是否登录成功
      if (response.code !== 0) {
        message.error(response.msg)
        return
      }

      // 存储token和用户id(cookie里)
      const { token, id } = response.data;

      setToken(token)
      setUid(id)

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      // 跳转到首页
      if (response.code === 0) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        // 是否有跳转的链接
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

        if (!redirect) {
          yield put(routerRedux.push('/'))
        } else {
          yield put(routerRedux.replace(redirect));
        }
        // 下面这两种方法都有bug,不能跳转到 /
        // yield put(routerRedux.replace(redirect || '/'));
        // yield put(routerRedux.push(redirect || '/'))
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
