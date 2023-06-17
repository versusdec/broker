import { UsersListGuard } from '../guards/users-list-guard';

export const withUsersListGuard = (Component) => (props) => (
  <UsersListGuard>
    <Component {...props} />
  </UsersListGuard>
);
