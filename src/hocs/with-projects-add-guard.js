import { ProjectsAddGuard } from '../guards/projects-add-guard';

export const withProjectsAddGuard = (Component) => (props) => (
  <ProjectsAddGuard>
    <Component {...props} />
  </ProjectsAddGuard>
);
