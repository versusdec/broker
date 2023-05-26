import {useCallback, useMemo, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Button, Card, Stack, SvgIcon, Typography} from '@mui/material';
import {RolesListTable} from '../../components/roles/roles-list-table';
import NextLink from "next/link";
import {paths} from "../../navigation/paths";
import {useMe} from "../../hooks/useMe";
import {useRoles} from "../../hooks/useRoles";
import {usePagination} from "../../hooks/usePagination";
import {withRolesListGuard} from "../../hocs/with-roles-list-guard";
import {api} from "../../api";
import toast from "react-hot-toast";
import {useDispatch} from "../../store";
import {actions} from '../../slices/rolesSlice'

const Page = withRolesListGuard(() => {
  const dispatch = useDispatch();
  const {user} = useMe();
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  
  const params = useMemo(() => {
    return {
      limit: limit, offset: offset
    }
  }, [limit, page, offset]);
  
  const {data, loading} = useRoles(params);
  const {items, total} = data || {items: [], limit: limit, total: 0};
  
  const handleStatus = useCallback(async (id, status, cb) => {
    const res = await api.users.update({
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
      dispatch(actions.fillRoles(newItems))
    } else {
      toast.error('Something goes wrong')
    }
  }, [items])
  
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
            {user && (user.role === 'admin') && <Button
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
          <RolesListTable
            items={items}
            total={total}
            onPageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            limit={limit}
            page={page}
            loading={loading}
            handleStatus={handleStatus}
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
