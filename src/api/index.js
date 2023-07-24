import {root} from './config';
import {getToken} from "../utils/get-token";
import {wait} from "../utils/wait";

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
        return await fetch(root, init({params: params, method: 'auth.login'}));
      } catch (e) {
        return {
          error: e
        }
      }
    },
    login2fa: async (params) => {
      try {
        return await fetch(root, init({params: params, method: 'auth.login2fa'}));
      } catch (e) {
        return {
          error: e
        }
      }
    },
    register: async (params) => {
      try {
        return await fetch(root, init({params: params, method: 'auth.register'}));
      } catch (e) {
        return {
          error: e
        }
      }
    },
    reset: async (params) => {
      try {
        return await fetch(root, init({params: params, method: 'auth.restore'}));
      } catch (e) {
        return {
          error: e
        }
      }
    },
    restore: async (params) => {
      try {
        return await fetch(root, init({params: params, method: 'auth.password'}));
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
    },
    list: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'users.list'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    suggest: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'users.suggest'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    get: async (id) => {
      try {
        const {result, error} = await fetch(root, init({params: {id: +id}, method: 'users.get'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    add: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'users.add'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    status2fa: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'users.status2fa'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    
  },
  roles: {
    update: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'roles.update'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    list: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'roles.list'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    suggest: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'roles.suggest'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    get: async (id) => {
      try {
        const {result, error} = await fetch(root, init({params: {id: +id}, method: 'roles.get'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    add: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'roles.add'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
  },
  projects: {
    list: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.list'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    suggest: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.suggest'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    get: async (id) => {
      try {
        const {result, error} = await fetch(root, init({params: {id: +id}, method: 'projects.get'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    add: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.add'})).then(res => res.json());
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
        const {result, error} = await fetch(root, init({params: params, method: 'projects.update'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    
  },
  fields: {
    list: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.fields.list'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    suggest: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.fields.suggest'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    get: async (id) => {
      try {
        const {result, error} = await fetch(root, init({params: {id: +id}, method: 'projects.fields.get'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    add: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.fields.add'})).then(res => res.json());
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
        const {result, error} = await fetch(root, init({params: params, method: 'projects.fields.update'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    
  },
  tags: {
    list: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.tags.list'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    suggest: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.tags.suggest'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    get: async (id) => {
      try {
        const {result, error} = await fetch(root, init({params: {id: +id}, method: 'projects.tags.get'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    add: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.tags.add'})).then(res => res.json());
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
        const {result, error} = await fetch(root, init({params: params, method: 'projects.tags.update'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
  },
  queues: {
    list: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.queues.list'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    get: async (id) => {
      try {
        const {result, error} = await fetch(root, init({params: {id: +id}, method: 'projects.queues.get'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    suggest: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.queues.suggest'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    add: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.queues.add'})).then(res => res.json());
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
        const {result, error} = await fetch(root, init({params: params, method: 'projects.queues.update'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    setup: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.queues.users.setup'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
  },
  transactions: {
    list: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'transactions.list'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    add: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'transactions.add'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
  },
  payments: {
    list: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'payments.list'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    add: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'payments.add'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    pay: async (id) => {
      try {
        const {result, error} = await fetch(root, init({params: {id: id}, method: 'payments.pay'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    cancel: async (id) => {
      try {
        const {result, error} = await fetch(root, init({params: {id: id}, method: 'payments.cancel'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    
  },
  scripts: {
    list: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.scripts.list'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    get: async (id) => {
      try {
        const {result, error} = await fetch(root, init({params: {id: +id}, method: 'projects.scripts.get'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    suggest: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.scripts.suggest'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    add: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'projects.scripts.add'})).then(res => res.json());
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
        const {result, error} = await fetch(root, init({params: params, method: 'projects.scripts.update'})).then(res => res.json());
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
  support: {
    list: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'support.list'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    get: async (id) => {
      try {
        const {result, error} = await fetch(root, init({params: {id: +id}, method: 'support.get'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    add: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'support.create'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    answer: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'support.answer'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    archive: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'support.archive'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    close: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'support.close'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    reopen: async (params) => {
      try {
        const {result, error} = await fetch(root, init({params: params, method: 'support.reopen'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    stats: async () => {
      try {
        const {result, error} = await fetch(root, init({method: 'support.stats'})).then(res => res.json());
        return {
          result, error
        }
      } catch (e) {
        return {
          error: e
        }
      }
    },
    moderation: {
      accept: async (params) => {
        try {
          const {result, error} = await fetch(root, init({params: params, method: 'support.moderation.accept'})).then(res => res.json());
          return {
            result, error
          }
        } catch (e) {
          return {
            error: e
          }
        }
      },
      decline: async (params) => {
        try {
          const {result, error} = await fetch(root, init({params: params, method: 'support.moderation.decline'})).then(res => res.json());
          return {
            result, error
          }
        } catch (e) {
          return {
            error: e
          }
        }
      },
      get: async (params) => {
        try {
          const {result, error} = await fetch(root, init({params: params, method: 'support.moderation.get'})).then(res => res.json());
          return {
            result, error
          }
        } catch (e) {
          return {
            error: e
          }
        }
      },
      handle: async (params) => {
        try {
          const {result, error} = await fetch(root, init({params: params, method: 'support.moderation.handle'})).then(res => res.json());
          return {
            result, error
          }
        } catch (e) {
          return {
            error: e
          }
        }
      },
      list: async (params) => {
        try {
          const {result, error} = await fetch(root, init({params: params, method: 'support.moderation.list'})).then(res => res.json());
          return {
            result, error
          }
        } catch (e) {
          return {
            error: e
          }
        }
      },
      my: async (params) => {
        try {
          const {result, error} = await fetch(root, init({params: params, method: 'support.moderation.my'})).then(res => res.json());
          return {
            result, error
          }
        } catch (e) {
          return {
            error: e
          }
        }
      },
    }
  },
});
