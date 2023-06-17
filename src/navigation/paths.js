export const paths = Object.freeze({
  index: '/',
  not_found: '/404',
  denied: '/denied',
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
  projects: {
    index: '/projects',
    add: '/projects/add'
  },
  project: {
    index: '/:project',
  },
  roles: {
    index: '/roles',
    add: '/roles/add',
    edit: '/roles/:id'
  },
  queues: {
    index: '/queues',
    add: '/queues/add',
    edit: '/queues/:id'
  },
  scripts: {
    index: '/scripts',
    add: '/scripts/add',
    edit: '/scripts/:id'
  },
});
