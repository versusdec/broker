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
    edit: '/users/:userId'
  },
});
