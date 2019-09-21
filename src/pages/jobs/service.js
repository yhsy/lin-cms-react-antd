import request from '@/utils/request';
// 获取招聘信息列表
export async function getJobsList (params) {
  return request('/jobs/list', {
    params,
  });
}
// 添加招聘信息
export async function addJobs (data) {
  return request('/jobs/add', {
    method: 'POST',
    data,
  });
}
// 编辑招聘信息
export async function editJobs (data) {
  return request('/jobs/edit', {
    method: 'POST',
    data,
  });
}
// 删除招聘信息
export async function delJobs (data) {
  return request('/jobs/del', {
    method: 'POST',
    data,
  });
}
