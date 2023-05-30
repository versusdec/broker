import { TransactionsListGuard } from '../guards/transactions-list-guard';

export const withTransactionsListGuard = (Component) => (props) => (
  <TransactionsListGuard>
    <Component {...props} />
  </TransactionsListGuard>
);
