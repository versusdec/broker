import {decode, JWT_EXPIRES_IN, JWT_SECRET, sign} from '../utils/jwt';
import {root} from './config';

const init = (body) => {
  let cookies = {};
  if (document.cookie.split(';')[0] !== "") {
    document.cookie.split(';').forEach(item => {
      cookies[item.split('=')[0].trim()] = item.split('=')[1].trim()
    })
  }
  
  let token = cookies['__token'];
  
  return {
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      'token': token
    },
    body: JSON.stringify(body),
    method: "POST"
  }
}

export const api = Object.freeze({
  auth: {
    login: async (params) => {
      // const res = await fetch(root, init({params: params, method: 'auth.login'}));
      return await fetch(root, init({params: params, method: 'auth.login'}));
    }
  }
});
