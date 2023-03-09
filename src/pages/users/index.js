import {useCallback, useMemo, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Box, Button, Card, Stack, SvgIcon, Typography} from '@mui/material';
import {UserListTable} from '../../components/users/user-list-table';
import NextLink from "next/link";
import {paths} from "../../navigation/paths";
import {useMe} from "../../hooks/useMe";
import {useUsers} from "../../hooks/useUsers";
import {usePagination} from "../../hooks/usePagination";
import {UsersListFilters} from "../../components/users-list-filters";
import {Loader} from "../../components/loader";


const Page = () => {
  const {user} = useMe();
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const [filters, setFilters] = useState({});
  
  const handleFiltersChange = useCallback((filters) => {
    handlePageChange(null, 0)
    setFilters(filters)
  }, [filters])
  
  const params = useMemo(() => {
    return {
      limit: limit, offset: offset,
      ...filters
    }
  }, [limit, offset, filters]);
  
  const {users, loading, error} = useUsers(params);
  const {items, total} = users || {items: [], limit: limit, total: 0};
  
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
            {user && (user.role === 'admin' || user.role === 'client') && <Button
              component={NextLink}
              href={paths.users.edit}
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
          />
          <UserListTable
            users={items}
            total={total}
            onPageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            limit={limit}
            page={page}
            loading={loading}
          />
        </Card>
      </Stack>
    </>
  );
};

Page.defaultProps = {
  title: 'Users'
};

export default Page;
