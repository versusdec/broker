import { QueuesListGuard } from '../guards/queues-list-guard';

export const withQueuesListGuard = (Component) => (props) => (
  <QueuesListGuard>
    <Component {...props} />
  </QueuesListGuard>
);
