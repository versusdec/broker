import {useCallback, useEffect, useMemo, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, SvgIcon, Tab, Tabs, Typography} from '@mui/material';
import NextLink from "next/link";
import {paths} from "../../navigation/paths";
import {useMe} from "../../hooks/useMe";
import {usePagination} from "../../hooks/usePagination";
import {api} from "../../api";
import toast from "react-hot-toast";
import {useDispatch} from "../../store";
import {actions} from '../../slices/transactionsSlice'
import {useTransactions} from "../../hooks/useTransactions";
import {usePayments} from "../../hooks/usePayments";
import {TransactionsTable} from "../../components/transactions-table";
import {Close} from "@mui/icons-material";
import {PaymentsTable} from "../../components/payments-table";
import {wait} from "../../utils/wait";

const tabs = [
  {
    label: 'Transactions',
    value: 'transactions'
  },
  {
    label: 'Payments',
    value: 'payments'
  }
];

const Page = () => {
  const dispatch = useDispatch();
  const {user} = useMe();
  const [filtersTransactions, setFiltersTransactions] = useState({limit: 10});
  const [filtersPayments, setFiltersPayments] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('transactions');
  const [clients, setClients] = useState(null);
  
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
  }, [])
  
  const filtersHandleTransactions = useCallback((filters) => {
    setFiltersTransactions(prev => ({
        ...prev,
        ...filters
      })
    )
  }, [filtersTransactions])
  
  const filtersHandlePayments = useCallback((filters) => {
    setFiltersPayments(prev => ({
        ...prev,
        ...filters
      })
    )
  }, [filtersPayments])
  
  useEffect(() => {
    if (user && user.role !== 'admin') {
      setFiltersTransactions(prev => ({
        ...prev,
        user_id: user.id
      }))
      setFiltersPayments(prev => ({
        ...prev,
        user_id: user.id
      }))
    }
  }, [user])
  
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
  }, [])
  
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
  }, [])
  
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
            {user && (user.role === 'admin') && currentTab === 'transactions' && <Button
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
              Add Transaction
            </Button>}
            {user && (user.role === 'admin' || user.role === 'client') && currentTab === 'payments' && <Button
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
              Create Payment
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
            {tabs.map((tab) => {
              switch (tab) {
                case 'payments':
                  if (['admin', 'client'].includes(user.role)) {
                    return <Tab
                      key={tab.value}
                      label={tab.label}
                      value={tab.value}
                    />
                  }
                  break;
                default:
                  return <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />
              }
            })}
          </Tabs>
          <Divider/>
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
                userRole={user?.role}
              />}
            </div>
          )}
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
                userRole={user?.role}
                onPay={paymentPay}
                onCancel={paymentCancel}
              />}
            </div>
          )}
        </Card>
      </Stack>
    
    </>
  );
}

Page.defaultProps = {
  title: 'Billing'
};

export default Page;
