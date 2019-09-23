/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 08:50:31
 * @LastEditTime: 2019-09-23 08:50:31
 * @LastEditors: your name
 */
import request from '@/utils/request';
// 获取加盟信息列表
export async function getJoinList (params) {
  return request('/join/list', {
    params,
  });
}
// 获取栏目列表(栏目ID和名称)
// export async function getColumnsList (params) {
//   return request('/columns/list', {
//     params,
//   });
// }
// 添加加盟信息
export async function addJoin (data) {
  return request('/join/add', {
    method: 'POST',
    data,
  });
}
// 编辑加盟信息
export async function editJoin (data) {
  return request('/join/edit', {
    method: 'POST',
    data,
  });
}
// 删除加盟信息
export async function delJoin (data) {
  return request('/join/del', {
    method: 'POST',
    data,
  });
}
