import {useCallback, useEffect, useMemo, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Button, Card, Stack, SvgIcon, Typography} from '@mui/material';
import {ProjectsListTable} from '../../components/projects/projects-list-table';
import NextLink from "next/link";
import {paths} from "../../navigation/paths";
import {useMe} from "../../hooks/useMe";
import {usePagination} from "../../hooks/usePagination";
import {ProjectsListFilters} from "../../components/projects-list-filters";
import {useProjects} from "../../hooks/useProjects";
import {api} from "../../api";
import {projectsList} from "../../slices/projectsSlice";
import toast from "react-hot-toast";
import {useDispatch} from "../../store";
import {useGrants} from "../../hooks/useGrants";
import {withProjectsListGuard} from "../../hocs/with-projects-list-guard";

const Page = withProjectsListGuard(() => {
  const dispatch = useDispatch();
  const me = useMe();
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const [filters, setFilters] = useState({status: 'active'});
  const grants = useGrants(me.data?.role_id);
  const isAdmin = me.data && me.data.role === 'admin';
  
  const handleFiltersChange = useCallback((filters) => {
    setFilters(filters)
  }, [])
  
  const params = useMemo(() => {
    return {
      limit: limit, offset: offset,
      ...filters
    }
  }, [limit, offset, filters]);
  
  const {data, loading, error} = useProjects(params);
  const {items, total} = data && data || {items: [], limit: limit, total: 0};
  
  const handleStatus = useCallback(async (id, status, cb) => {
    const res = await api.projects.update({
      id: +id,
      status: status === 'archived' ? 'active' : 'archived'
    })
    if (res) {
      cb();
      dispatch(projectsList(params))
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
              Projects
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={3}
          >
            {me.data && (me.data.role_id === 0 || grants.includes('projects.write')) && <Button
              component={NextLink}
              href={paths.projects.add}
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
          <ProjectsListFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />
          <ProjectsListTable
            projects={items}
            total={total}
            onPageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            limit={limit}
            page={page}
            loading={loading}
            handleStatus={handleStatus}
            grants={grants}
            isAdmin={isAdmin}
          />
        </Card>
      </Stack>
    </>
  );
})

Page.defaultProps = {
  title: 'Projects'
};

export default Page;
