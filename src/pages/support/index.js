import {useCallback, useMemo, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Button, Card, Stack, SvgIcon, Typography} from '@mui/material';
import {TicketsListTable} from '../../components/support/tickets-list-table';
import NextLink from "next/link";
import {paths} from "../../navigation/paths";
import {useMe} from "../../hooks/useMe";
import {usePagination} from "../../hooks/usePagination";
import {api} from "../../api";
import {ticketsList} from "../../slices/ticketsSlice";
import toast from "react-hot-toast";
import {useDispatch} from "../../store";
import {useSupport} from "../../hooks/useSupport";


const Page = () => {
  const dispatch = useDispatch();
  const me = useMe();
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const [filters, setFilters] = useState({});
  
  const handleFiltersChange = useCallback((filters) => {
    setFilters(filters)
  }, [])
  
  const params = useMemo(() => {
    return {
      limit: limit, offset: offset,
      ...filters
    }
  }, [limit, offset, filters]);
  
  const {data, loading, error} = useSupport(params);
  const {items, total} = data && data || {items: [], limit: limit, total: 0};
  
  const handleArchive = useCallback(async (id, cb) => {
    const res = await api.support.archive({
      id: +id
    })
    if (res) {
      cb();
      dispatch(ticketsList(params))
    } else {
      toast.error('Something went wrong')
    }
  }, [dispatch, params])
  
  const handleClose = useCallback(async (id, cb) => {
    const res = await api.support.close({
      id: +id,
    })
    if (res) {
      cb();
      dispatch(ticketsList(params))
    } else {
      toast.error('Something went wrong')
    }
  }, [dispatch, params])
  
  const handleReopen = useCallback(async (id, cb) => {
    const res = await api.support.reopen({
      id: +id,
    })
    if (res) {
      cb();
      dispatch(ticketsList(params))
    } else {
      toast.error('Something went wrong')
    }
  }, [dispatch, params])
  
  
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
              href={paths.support.add}
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
          <TicketsListTable
            tickets={items}
            total={total}
            onPageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            limit={limit}
            page={page}
            loading={loading}
            handleStatus={handleStatus}
            onFiltersChange={handleFiltersChange}
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
