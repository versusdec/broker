import { UsersAddGuard } from '../guards/users-add-guard';

export const withUsersAddGuard = (Component) => (props) => (
  <UsersAddGuard>
    <Component {...props} />
  </UsersAddGuard>
);
