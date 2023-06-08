import { ScriptsAddGuard } from '../guards/scripts-add-guard';

export const withScriptsAddGuard = (Component) => (props) => (
  <ScriptsAddGuard>
    <Component {...props} />
  </ScriptsAddGuard>
);
