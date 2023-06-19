import {useCallback, useMemo, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Button, Card, Stack, SvgIcon, Typography} from '@mui/material';
import {QueuesListFilters} from "../../../components/queues/queues-list-filters";
import {QueuesListTable} from '../../../components/queues/queues-list-table';
import NextLink from "next/link";
import {paths} from "../../../navigation/paths";
import {useMe} from "../../../hooks/useMe";
import {useQueues} from "../../../hooks/useQueues";
import {usePagination} from "../../../hooks/usePagination";
import {api} from "../../../api";
import toast from "react-hot-toast";
import {useDispatch} from "../../../store";
import {actions} from '../../../slices/queuesSlice'
import {useRouter} from "next/router";
import {withQueuesListGuard} from "../../../hocs/with-queues-list-guard";

const Page = withQueuesListGuard(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const me = useMe();
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const [filters, setFilters] = useState({});
  const project_id = +router.query.project;
  
  const handleFiltersChange = useCallback((filters) => {
    setFilters(filters)
  }, [])
  
  const params = useMemo(() => {
    return {
      limit: limit, offset: offset,
      ...filters
    }
  }, [limit, offset, filters]);
  
  const {data, loading, error} = useQueues(params);
  const {items, total} = data || {items: [], limit: limit, total: 0};
  
  const handleStatus = useCallback(async (id, status, cb) => {
    const res = await api.queues.update({
      id: +id,
      status: status === 'archived' ? 'active' : 'archived'
    })
    if (res) {
      cb();
      const newItems = items.map((i) => {
        if (i.id === +id) {
          return {
            ...i,
            status: status === 'archived' ? 'active' : 'archived'
          }
        } else return i
      })
      dispatch(actions.fillQueues(newItems))
    } else {
      toast.error('Something went wrong')
    }
  }, [items, dispatch])
  
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
              Queues
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={3}
          >
            <Button
              component={NextLink}
              href={`/${project_id + paths.queues.add}`}
              startIcon={(
                <SvgIcon>
                  <PlusIcon/>
                </SvgIcon>
              )}
              variant="contained"
            >
              Add
            </Button>
          </Stack>
        </Stack>
        <Card>
          <QueuesListFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />
          <QueuesListTable
            items={items}
            total={total}
            onPageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            limit={limit}
            page={page}
            loading={loading}
            handleStatus={handleStatus}
            project_id={project_id}
          />
        </Card>
      </Stack>
    </>
  );
})

Page.defaultProps = {
  title: 'Queues'
};

export default Page;
