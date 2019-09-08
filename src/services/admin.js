import request from '@/utils/request'
// 登录
export async function loginPwd (data) {
  return request('/admin/login', {
    method: 'POST',
    data,
  });
}
// 获取管理员信息
export async function getInfo () {
  return request('/admin/info');
}