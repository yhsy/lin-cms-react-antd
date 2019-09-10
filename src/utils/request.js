/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
// 路由控制跳转
import router from 'umi/router';
// import { notification, message } from 'antd';
import { message } from 'antd';

import { getToken, getUid, removeToken, removeUid } from '@/utils/auth';


const errorHandler = error => {
  if (error.code) {
    // 请求接口成功,返回有错误
    const msg = error.msg;
    message.error(msg);
    // token失效
    if (error.code === 20302 || error.code === 20301) {
      // 清除token及uid
      removeToken();
      removeUid();
      // 清除角色
      localStorage.removeItem('antd-pro-authority');
      // 跳转到登录页
      router.push('/user/login');
    }
  } else {
    // console.log(error);
    message.error('请求失败,请重试');
    // console.log(JSON.stringify(error))
  }
  return false;
};

/**
 * 配置request请求时的默认参数
 */

const request = extend({
  // 默认错误处理
  errorHandler,
  // 默认请求是否带上cookie (omit-省略不传,include-携带cookie)
  credentials: 'omit',
  // 请求接口统一加"/api"前缀
  prefix: '/api',
  // credentials: 'include',
});

// 白名单(不需要带header头)
// const whiteList = ['/api/admin/login']; // no redirect whitelist
// 请求拦截配置
// request拦截器
request.interceptors.request.use((url, options) => {
  if (getToken()) {
    const optionData = options;

    // 统一请求头
    optionData.headers.Authorization = 'Bearer ' + getToken()
    optionData.headers.id = getUid();
    return optionData;
  }
  return options;
});

// response拦截器
// 请求成功,返回的错误统一处理
request.interceptors.response.use(async response => {
  // console.log(response)
  const data = await response.clone().json();
  // mock的currentUser接口
  if (data.userid) {
    return response;
  }

  if (data.code !== 0) {
    // message.error(data.msg)
    // 错误提示抛出去(errorHandler处理)
    return Promise.reject(data || 'error');
  }

  // console.log(`data is ${JSON.stringify(data)}`)
  return response;
});

export default request;
