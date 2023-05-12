import { RolesListGuard } from '../guards/roles-list-guard';

export const withRolesListGuard = (Component) => (props) => (
  <RolesListGuard>
    <Component {...props} />
  </RolesListGuard>
);
