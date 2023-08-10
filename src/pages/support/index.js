import {useCallback, useEffect, useMemo, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Button,
  Card,
  Divider,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {TicketsListTable} from '../../components/support/tickets-list-table';
import NextLink from "next/link";
import {paths} from "../../navigation/paths";
import {usePagination} from "../../hooks/usePagination";
import {api} from "../../api";
import {ticketsList} from "../../slices/ticketsSlice";
import toast from "react-hot-toast";
import {useDispatch} from "../../store";
import {useTickets} from "../../hooks/useTickets";
import {useMe} from "../../hooks/useMe";

const tabs = [
  {
    label: 'Technical',
    value: 'tech'
  },
  {
    label: 'Financial',
    value: 'finance'
  },
  {
    label: 'Archived',
    value: 'archived'
  },

];

const Page = () => {
  const dispatch = useDispatch();
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const [filters, setFilters] = useState({theme: 'tech'});
  const [currentTab, setCurrentTab] = useState('tech');
  const me = useMe();
  
  const handleTabsChange = useCallback((event, value) => {
    const fs = {...filters};
    switch (value) {
      case 'archived':
        delete fs.theme;
        fs.status = value;
        break;
      case 'finance':
      case 'tech':
        delete fs.status;
        fs.theme = value;
        break;
      default:
        void 0;
    }
    setCurrentTab(value);
    setFilters(fs);
  }, [filters]);
  
  const params = useMemo(() => {
    console.log(filters)
    return {
      limit: limit, offset: offset,
      ...filters
    }
  }, [limit, offset, filters]);
  
  const {data, loading, error} = useTickets(params);
  const {items, total} = data && data || {items: [], limit: limit, total: 0};
  
  const onStatusChange = useCallback(async (dialog) => {
    const {result, error} = await api.support[dialog.action](dialog.item.id);
    if (result) {
      dispatch(ticketsList(params))
    } else toast.error('Something went wrong')
  }, [])
  
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
              Support
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={3}
          >
            {<Button
              component={NextLink}
              href={paths.support.new}
              startIcon={(
                <SvgIcon>
                  <PlusIcon/>
                </SvgIcon>
              )}
              variant="contained"
            >
              Create a New Ticket
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
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
          <Divider/>
          <TicketsListTable
            tickets={items}
            total={total}
            onPageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            limit={limit}
            page={page}
            loading={loading}
            handleStatus={onStatusChange}
            user={me.data}
          />
        </Card>
      </Stack>
    </>
  );
}

Page.defaultProps = {
  title: 'Support'
};

export default Page;
