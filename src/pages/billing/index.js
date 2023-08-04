import {useCallback, useEffect, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Button, Card, Divider, Stack, SvgIcon, Tab, Tabs, Typography} from '@mui/material';
import {useMe} from "../../hooks/useMe";
import {api} from "../../api";
import toast from "react-hot-toast";
import {useTransactions} from "../../hooks/useTransactions";
import {usePayments} from "../../hooks/usePayments";
import {TransactionsTable} from "../../components/transactions-table";
import {PaymentsTable} from "../../components/payments-table";
import {wait} from "../../utils/wait";
import {useGrants} from "../../hooks/useGrants";
import {withTransactionsListGuard} from "../../hocs/with-transactions-list-guard";



const Page = withTransactionsListGuard(() => {
  const {data} = useMe();
  const [filtersTransactions, setFiltersTransactions] = useState({limit: 10});
  const [filtersPayments, setFiltersPayments] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('payments');
  const [clients, setClients] = useState(null);
  const grants = useGrants(data && data.role_id);
  const isAdmin = data && data.role === 'admin';
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);
  
  const getClients = useCallback(async () => {
    const {result, error} = await api.users.list({
      role: 'client',
      status: 'active',
      limit: 1000
    })
    if (result) {
      setClients(result.items)
    }
  }, [])
  
  useEffect(() => {
    getClients()
  }, [getClients])
  
  const filtersHandleTransactions = useCallback((filters) => {
    setFiltersTransactions(prev => ({
        ...prev,
        ...filters
      })
    )
  }, [])
  
  const filtersHandlePayments = useCallback((filters) => {
    setFiltersPayments(prev => ({
        ...prev,
        ...filters
      })
    )
  }, [])
  
  const transactions = useTransactions(filtersTransactions);
  const payments = usePayments(filtersPayments);
  
  const transactionsCreate = useCallback(async (params) => {
    await wait(500)
    const {result, error} = await api.transactions.add(params);
    if (result) {
      setDialogOpen(false)
      transactions.update()
    }
    if (error) {
      toast.error(error.message)
    }
  }, [transactions])
  
  const paymentsCreate = useCallback(async (params) => {
    await wait(500)
    const {result, error} = await api.payments.add(params);
    if (result) {
      setDialogOpen(false)
      payments.update()
    }
    if (error) {
      toast.error(error.message)
    }
  }, [payments])
  
  const paymentPay = async (id, cb) => {
    const {result, error} = await api.payments.pay(id);
    
    if (result) {
      window.open(result, 'blank', 'noreferrer noopener')
      cb();
    }
    if (error) {
      toast.error(error.message)
    }
  }
  
  const paymentCancel = async (id, cb) => {
    const {result, error} = await api.payments.pay(id);
    if (result) {
      payments.update()
      cb();
    }
    if (error) {
      toast.error(error.message)
    }
  }
  
  return (
    <>
      <Stack spacing={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}
        >
          <Stack spacing={1}>
            <Typography variant="h4">
              Billing
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={3}
          >
            {isAdmin && currentTab === 'transactions' && <Button
              onClick={() => {
                setDialogOpen(true)
              }}
              startIcon={(
                <SvgIcon>
                  <PlusIcon/>
                </SvgIcon>
              )}
              variant="contained"
            >
              Make New Transaction
            </Button>}
            {isAdmin && currentTab === 'payments' && <Button
              onClick={() => {
                setDialogOpen(true)
              }}
              startIcon={(
                <SvgIcon>
                  <PlusIcon/>
                </SvgIcon>
              )}
              variant="contained"
            >
              Make New Payment
            </Button>}
          </Stack>
        </Stack>
        <Card>
          <Tabs
            indicatorColor="primary"
            onChange={handleTabsChange}
            scrollButtons="auto"
            sx={{px: 3}}
            textColor="primary"
            value={currentTab}
            variant="scrollable"
          >
            {(isAdmin || grants.includes('payments.read')) && <Tab
              key={'payments'}
              label={'Payments'}
              value={'payments'}
            />}
            <Tab
              key={'transactions'}
              label={'Transactions'}
              value={'transactions'}
            />
          </Tabs>
          <Divider/>
          {currentTab === 'payments' && (
            <div>
              {<PaymentsTable
                payments={payments}
                onFiltersChange={filtersHandlePayments}
                dialogOpen={dialogOpen}
                dialogClose={() => {
                  setDialogOpen(false)
                }}
                onSubmit={paymentsCreate}
                isAdmin={isAdmin}
                onPay={paymentPay}
                onCancel={paymentCancel}
                filters={filtersPayments}
              />}
            </div>
          )}
          {currentTab === 'transactions' && (
            <div>
              {<TransactionsTable
                transactions={transactions}
                onFiltersChange={filtersHandleTransactions}
                dialogOpen={dialogOpen}
                dialogClose={() => {
                  setDialogOpen(false)
                }}
                clients={clients}
                onSubmit={transactionsCreate}
                isAdmin={isAdmin}
                filters={filtersTransactions}
              />}
            </div>
          )}
        </Card>
      </Stack>
    
    </>
  );
})

Page.defaultProps = {
  title: 'Billing'
};

export default Page;
