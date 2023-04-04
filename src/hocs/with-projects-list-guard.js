import { ProjectsListGuard } from '../guards/projects-list-guard';

export const withProjectsListGuard = (Component) => (props) => (
  <ProjectsListGuard>
    <Component {...props} />
  </ProjectsListGuard>
);
