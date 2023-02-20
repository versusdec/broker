import { root } from './config';

export const api = Object.freeze({
  auth: {
    login: (params) => {
      return fetch(`${root}/`, {
        method: 'POST',
        body: {
          method: 'auth.login',
          params: params
        }
      });
    }
  }
});
