import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';
const TokenUid = 'Admin-Uid';
/* Token存取--start */
export function getToken () {
  return Cookies.get(TokenKey);
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, { expires: 1 });
}

export function removeToken () {
  return Cookies.remove(TokenKey);
}
/* Token存取--end */

/* Uid存取--start */
export function getUid () {
  return Cookies.get(TokenUid);
}

export function setUid (uid) {
  return Cookies.set(TokenUid, uid, { expires: 1 });
}

export function removeUid () {
  return Cookies.remove(TokenUid);
}
/* Uid存取--end */