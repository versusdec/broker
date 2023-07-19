export const paths = Object.freeze({
  index: '/',
  not_found: '/404/',
  denied: '/denied/',
  login: '/auth/login/',
  register: '/auth/register/',
  forgot: '/auth/reset/',
  reset: '/auth/restore/',
  account: '/account/',
  billing: '/billing/',
  users: {
    index: '/users/',
    manager: '/users/manager/',
    operator: '/users/operator/',
    edit: '/users/edit/:user/',
    add: '/users/edit/new/'
  },
  projects: {
    index: '/projects/',
    add: '/projects/add/'
  },
  project: {
    index: '/:project/',
  },
  roles: {
    index: '/roles/',
    add: '/roles/add/',
    edit: '/roles/:id/'
  },
  queues: {
    index: '/queues/',
    add: '/queues/add/',
    edit: '/queues/:id/'
  },
  scripts: {
    index: '/scripts/',
    add: '/scripts/add/',
    edit: '/scripts/:id/'
  },
  support: {
    index: '/support/',
    add: '/support/add/',
    ticket: '/support/:id/'
  }
});
