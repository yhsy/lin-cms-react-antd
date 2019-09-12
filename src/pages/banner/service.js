/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-12 08:36:39
 * @LastEditTime: 2019-09-12 09:30:59
 * @LastEditors: Please set LastEditors
 */
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
// 编辑Banner
export async function editBanner (data) {
  return request('/home/banner/edit', {
    method: 'POST',
    data,
  });
}
// 显示隐藏Banner
export async function editBannerShow (data) {
  return request('/home/banner/is_show', {
    method: 'POST',
    data,
  });
}
// 删除Banner
export async function delBanner (data) {
  return request('/home/banner/del', {
    method: 'POST',
    data,
  });
}
