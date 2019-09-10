import request from '@/utils/request';
// 获取Banner列表
export async function getBannerList (params) {
  return request('/home/banner/list', {
    params,
  });
}