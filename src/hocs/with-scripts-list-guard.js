import { ScriptsListGuard } from '../guards/scripts-list-guard';

export const withScriptsListGuard = (Component) => (props) => (
  <ScriptsListGuard>
    <Component {...props} />
  </ScriptsListGuard>
);
