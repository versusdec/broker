import { RolesAddGuard } from '../guards/roles-add-guard';

export const withRolesAddGuard = (Component) => (props) => (
  <RolesAddGuard>
    <Component {...props} />
  </RolesAddGuard>
);
