import request from '@/utils/request-mock';
export async function query () {
  return request('/api/users');
}
export async function queryCurrent () {
  return request('/api/currentUser');
}
export async function queryNotices () {
  return request('/api/notices');
}
