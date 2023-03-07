import {domain} from "../api/config";

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

export const setToken = (token) => {
  let t = token && JSON.parse(b64DecodeUnicode(token.split(".")[1])) || {role: 'public'};
  document.cookie = `__token=${token};domain=${domain};expires=${t.exp}; path=/`
}