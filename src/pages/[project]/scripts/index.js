import {useCallback, useMemo, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, SvgIcon, Typography} from '@mui/material';
import {ScriptsListFilters} from "../../../components/scripts/scripts-list-filters";
import {ScriptsListTable} from '../../../components/scripts/scripts-list-table';
import NextLink from "next/link";
import {paths} from "../../../navigation/paths";
import {useMe} from "../../../hooks/useMe";
import {useScripts} from "../../../hooks/useScripts";
import {usePagination} from "../../../hooks/usePagination";
import {api} from "../../../api";
import toast from "react-hot-toast";
import {useDispatch} from "../../../store";
import {useRouter} from "next/router";
import {withScriptsListGuard} from "../../../hocs/with-scripts-list-guard";
import {Close} from "@mui/icons-material";
import {Loader} from "../../../components/loader";

const Page = withScriptsListGuard(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const me = useMe();
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const [filters, setFilters] = useState({});
  const project_id = +router.query.project;
  const [dialog, setDialog] = useState({open: false, item: null});
  const [cloning, setCloning] = useState(false);
  
  const handleDialogOpen = useCallback((item) => {
    setDialog({
      open: true,
      item: item
    })
  }, [])
  
  const handleDialogClose = useCallback(() => {
    setDialog({
      open: false,
      item: null
    })
  }, [])
  
  const handleFiltersChange = useCallback((filters) => {
    setFilters(filters)
  }, [filters])
  
  const params = useMemo(() => {
    return {
      limit: limit, offset: offset,
      ...filters
    }
  }, [limit, page, offset, filters]);
  
  const {data, loading, error, update} = useScripts(params);
  const {items, total} = data || {items: [], limit: limit, total: 0};
  
  const handleStatus = useCallback(async (id, status, cb) => {
    const res = await api.scripts.update({
      id: +id,
      status: status === 'archived' ? 'active' : 'archived'
    })
    if (res) {
      cb();
      update()
    } else {
      toast.error('Something went wrong')
    }
  }, [items])
  
  const cloneScript = useCallback(async (id, cb) => {
    setCloning(true);
    const get = await api.scripts.get(id);
    if (get.result) {
      delete get.result.id
      const add = await api.scripts.add(get.result)
      if (add.result) {
        toast.success('Script cloned')
        update()
      }
      if (add.error) {
        toast.error('Something went wrong')
      }
    }
    if (get.error) {
      toast.error('Something went wrong')
    }
    setCloning(false)
    cb()
  }, [])
  
  const handleClone = (item) => {
    setDialog({open: true, item: item})
  }
  
  return (
    <>
      {cloning && <Loader backdrop/>}
      <Stack spacing={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}
        >
          <Stack spacing={1}>
            <Typography variant="h4">
              Scripts
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={3}
          >
            {me.data?.role !== 'manager' && <Button
              component={NextLink}
              href={`/${project_id + paths.scripts.add}`}
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
          <ScriptsListFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />
          <ScriptsListTable
            items={items}
            total={total}
            onPageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            limit={limit}
            page={page}
            loading={loading}
            handleStatus={handleStatus}
            project_id={project_id}
            userRole={me.data?.role}
            handleClone={handleClone}
          />
        </Card>
      </Stack>
      <Dialog
        open={dialog.open}
        onClose={handleDialogClose}
        scroll={'paper'}
        maxWidth={'sm'}
        fullWidth
      >
        <DialogTitle sx={{pr: 10}}>
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.primary.main,
            }}
          >
            <Close/>
          </IconButton>
          {`Clone script?`}
        </DialogTitle>
        <DialogContent dividers>
          {dialog.item && 'Script '} <Typography component={'span'} variant={'subtitle1'}>{dialog.item && dialog.item?.name}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            type={'button'}
            variant={'outlined'}
            color={'error'}
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button
            type={'button'}
            variant={'contained'}
            onClick={() => {
              cloneScript(dialog.item.id, () => {
                handleDialogClose()
              })
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
})

Page.defaultProps = {
  title: 'Scripts'
};

export default Page;
