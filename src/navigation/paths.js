export const paths = Object.freeze({
  index: '/',
  login: '/auth/login',
  register: '/auth/register',
  forgot: '/auth/reset',
  reset: '/auth/restore',
  account: '/account',
  billing: '/billing',
  support: '/support',
  users: {
    index: '/users',
    edit: '/users/:user',
    add: '/users/add'
  },
  queues: {
    index: '/queues',
    edit: '/queues/:id',
    add: '/queues/add'
  },
  projects: {
    index: '/projects',
    edit: '/projects/:id',
    project: '/projects/:id/:project',
    add: '/projects/add'
  },
  project: {
    index: '/project/:id',
  },
});
