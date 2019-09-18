/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-18 08:46:19
 * @LastEditTime: 2019-09-18 08:46:19
 * @LastEditors: your name
 */
import request from '@/utils/request';
// 获取文章列表
export async function getArticleList (params) {
  return request('/article/list', {
    params,
  });
}
// 添加文章
export async function addArticle (data) {
  return request('/article/add', {
    method: 'POST',
    data,
  });
}
// 编辑文章
export async function editArticle (data) {
  return request('/article/edit', {
    method: 'POST',
    data,
  });
}
// 删除文章
export async function delArticle (data) {
  return request('/article/del', {
    method: 'POST',
    data,
  });
}
