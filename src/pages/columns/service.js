import request from '@/utils/request';
// 获取栏目列表
export async function getColumnsList (params) {
  return request('/columns/list', {
    params,
  });
}
// 添加栏目
export async function addColumns (data) {
  return request('/columns/add', {
    method: 'POST',
    data,
  });
}
// 编辑栏目
export async function editColumns (data) {
  return request('/columns/edit', {
    method: 'POST',
    data,
  });
}
// 删除栏目
export async function delColumns (data) {
  return request('/columns/del', {
    method: 'POST',
    data,
  });
}
