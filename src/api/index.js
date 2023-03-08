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
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'auth.login'}));
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    login2fa: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'auth.login2fa'}));
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    register: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'auth.register'}));
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    restore: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'auth.restore'}));
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    password: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'auth.password'}));
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    }
  },
  users: {
    me: async () => {
      try {
        const {result, error} = await fetch(root, init({params: {}, method: 'users.me'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    update: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'users.update'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    qr: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'users.qr'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    }
  }
});
