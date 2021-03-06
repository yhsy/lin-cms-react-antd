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

// 修改密码
export async function changePassword (data) {
  return request('/admin/change_password', {
    method: 'POST',
    data,
  });
}

// 上传图片(七牛云)
export async function uploadImg (data) {
  return request('/upload/qiniu_img', {
    method: 'POST',
    data,
  });
}
