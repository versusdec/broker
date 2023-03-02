import {root} from './config';
import {getToken} from "../utils/get-token";

const init = (body) => {
 const token = getToken()
  
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
  },
  users: {
    me: async ()=>{
      return await fetch(root, init({params: {}, method: 'users.me'})).then(res=>res.json());
    }
  }
});
