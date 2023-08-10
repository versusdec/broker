import {useCallback, useMemo, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Button, Card, Stack, SvgIcon, Typography} from '@mui/material';
import {RolesListTable} from '../../components/roles/roles-list-table';
import {RolesListFilters} from "../../components/roles/roles-list-filters";
import NextLink from "next/link";
import {paths} from "../../navigation/paths";
import {useMe} from "../../hooks/useMe";
import {useRoles} from "../../hooks/useRoles";
import {usePagination} from "../../hooks/usePagination";
import {withRolesListGuard} from "../../hocs/with-roles-list-guard";
import {api} from "../../api";
import toast from "react-hot-toast";
import {useDispatch} from "../../store";
import {actions} from '../../slices/rolesSlice';

const Page = withRolesListGuard(() => {
  const dispatch = useDispatch();
  const me = useMe();
  const isAdmin = me.data && me.data.role === 'admin';
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const [filters, setFilters] = useState({});
  
  const handleFiltersChange = useCallback((filters) => {
    setFilters(filters)
  }, [])
  
  const params = useMemo(() => {
    return {
      limit: limit, offset: offset, ...filters
    }
  }, [limit, offset, filters]);
  
  const {data, loading} = useRoles(params);
  const {items, total} = data || {items: [], limit: limit, total: 0};
  
  const handleStatus = useCallback(async (id, status, cb) => {
    const res = await api.roles.update({
      id: +id,
      status: status === 'archived' ? 'active' : 'archived'
    })
    if (res) {
      cb();
      const {result, error} = await api.roles.list(params)
      if (result) dispatch(actions.fillRoles(result.items))
      else if (error) toast.error('Something went wrong')
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
              Roles
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={3}
          >
            {me.data && (me.data.role_id === 0) && <Button
              component={NextLink}
              href={paths.roles.add}
              startIcon={(
                <SvgIcon>
                  <PlusIcon/>
                </SvgIcon>
              )}
              variant="contained"
            >
              Add
            </Button>}
          </Stack>
        </Stack>
        <Card>
          {isAdmin && <RolesListFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />}
          <RolesListTable
            items={items}
            total={total}
            onPageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            limit={limit}
            page={page}
            loading={loading}
            handleStatus={handleStatus}
            isAdmin={isAdmin}
          />
        </Card>
      </Stack>
    </>
  );
})

Page.defaultProps = {
  title: 'Roles'
};

export default Page;
