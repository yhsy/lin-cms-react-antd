/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 08:57:32
 * @LastEditTime: 2019-09-25 09:13:44
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request';
// 获取管理员列表
export async function getAdminList (params) {
  return request('/admin/list', {
    params,
  });
}
// 添加管理员
export async function addAdmin (data) {
  return request('/admin/add', {
    method: 'POST',
    data,
  });
}
// 编辑管理员
export async function editAdmin (data) {
  return request('/admin/edit', {
    method: 'POST',
    data,
  });
}
// 删除管理员
export async function delAdmin (data) {
  return request('/admin/delete', {
    method: 'POST',
    data,
  });
}
