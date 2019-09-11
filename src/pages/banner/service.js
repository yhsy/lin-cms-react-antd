import request from '@/utils/request';
// 获取Banner列表
export async function getBannerList (params) {
  return request('/home/banner/list', {
    params,
  });
}
// 添加Banner
export async function addBanner (data) {
  return request('/home/banner/add', {
    method: 'POST',
    data,
  });
}