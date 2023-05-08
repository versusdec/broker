import { QueuesAddGuard } from '../guards/queues-add-guard';

export const withQueuesAddGuard = (Component) => (props) => (
  <QueuesAddGuard>
    <Component {...props} />
  </QueuesAddGuard>
);
