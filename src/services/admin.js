import request from 'umi-request';
export async function loginPwd (data) {
  return request('/api/admin/login', {
    method: 'POST',
    data,
  });
}