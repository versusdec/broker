import {useCallback, useEffect, useMemo, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Button, Card, Stack, SvgIcon, Typography} from '@mui/material';
import {UsersListTable} from '../../components/users-list-table';
import {UsersListFilters} from "../../components/users-list-filters";
import NextLink from "next/link";
import {paths} from "../../navigation/paths";
import {useMe} from "../../hooks/useMe";
import {useUsers} from "../../hooks/useUsers";
import {usePagination} from "../../hooks/usePagination";
import {withUsersListGuard} from "../../hocs/with-users-list-guard";
import {api} from "../../api";
import toast from "react-hot-toast";
import {useDispatch} from "../../store";
import {actions} from '../../slices/usersSlice'
import {useGrants} from "../../hooks/useGrants";
import {useRouter} from "next/router";
import {useRoles} from "../../hooks/useRoles";

const Page = withUsersListGuard(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {data} = useMe();
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const [filters, setFilters] = useState({});
  const grants = useGrants(data?.role_id);
  const isAdmin = data && data.role_id === 0;
  const roles = useRoles(useMemo(()=>({limit: 1000, status: 'active'}), []))
  const role = router.query.id ?? ''
  
  const handleFiltersChange = useCallback((filters) => {
    setFilters(filters)
  }, [])
  
  useEffect(() => {
    role !== '' ? setFilters({role_id: +role}) : setFilters({});
  }, [role])
  
  const params = useMemo(() => {
    return {
      limit: limit, offset: offset,
      ...filters
    }
  }, [limit, offset, filters]);
  
  const {users, loading, error} = useUsers(params);
  const {items, total} = users || {items: [], limit: limit, total: 0};
  
  const handleStatus = useCallback(async (id, status) => {
    const res = await api.users.update({
      id: +id,
      status: status === 'blocked' ? 'active' : 'blocked'
    })
    if (res) {
      const newItems = items.map((i) => {
        if (i.id === +id) {
          return {
            ...i,
            status: status === 'blocked' ? 'active' : 'blocked'
          }
        } else return i
      })
      dispatch(actions.fillUsers(newItems))
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
              Users
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={3}
          >
            {data && (isAdmin || grants.includes('users.write')) && <Button
              component={NextLink}
              href={paths.users.add}
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
          <UsersListFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
            roles={roles.data?.items}
            role={role}
          />
          <UsersListTable
            users={items}
            total={total}
            onPageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            limit={limit}
            page={page}
            loading={loading}
            handleStatus={handleStatus}
            grants={grants}
            isAdmin={isAdmin}
            role={role}
          />
        </Card>
      </Stack>
    </>
  );
})

Page.defaultProps = {
  title: 'Users'
};

export default Page;
