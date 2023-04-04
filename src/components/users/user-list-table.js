import {useCallback, useEffect, useMemo, useState} from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {Block, CheckCircleOutlined, Close, EditOutlined} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow, Tooltip,
  Typography
} from '@mui/material';
import {Scrollbar} from '../scrollbar';
import {paths} from '../../navigation/paths';
import {Pagination} from "../pagination";
import {Loader} from "../loader";
import {wait} from "../../utils/wait";


const useSelectionModel = (users) => {
  const usersIds = useMemo(() => {
    return users.map((user) => user.id);
  }, [users]);
  const [selected, setSelected] = useState([]);
  
  useEffect(() => {
    setSelected([]);
  }, [usersIds]);
  
  const selectOne = useCallback((userId) => {
    setSelected((prevState) => [...prevState, userId]);
  }, []);
  
  const deselectOne = useCallback((userId) => {
    setSelected((prevState) => {
      return prevState.filter((id) => id !== userId);
    });
  }, []);
  
  const selectAll = useCallback(() => {
    setSelected([...usersIds]);
  }, [usersIds]);
  
  const deselectAll = useCallback(() => {
    setSelected([]);
  }, []);
  
  return {
    deselectAll,
    deselectOne,
    selectAll,
    selectOne,
    selected
  };
};

export const UserListTable = (props) => {
  const {
    users,
    total,
    onPageChange,
    handleLimitChange,
    page,
    limit,
    loading,
    handleStatus,
    ...other
  } = props;
  const {deselectAll, selectAll, deselectOne, selectOne, selected} = useSelectionModel(users);
  const [dialog, setDialog] = useState({open: false, user: null});
  
  const handleDialogOpen = useCallback((user) => {
    setDialog({
      open: true,
      user: user
    })
  }, [])
  
  const handleDialogClose = useCallback(() => {
    setDialog({
      open: false,
      user: null
    })
  }, [])
  
  const handleToggleAll = useCallback((event) => {
    const {checked} = event.target;
    
    if (checked) {
      selectAll();
    } else {
      deselectAll();
    }
  }, [selectAll, deselectAll]);
  
  const selectedAll = selected.length === users.length;
  const selectedSome = selected.length > 0 && selected.length < users.length;
  const enableBulkActions = selected.length > 0;
  
  return (
    <Box
      sx={{position: 'relative'}}
      {...other}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? 'neutral.800'
              : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={handleToggleAll}
          />
          <Button
            color="inherit"
            size="small"
          >
            Delete
          </Button>
          <Button
            color="inherit"
            size="small"
          >
            Edit
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{minWidth: 700}}>
          {loading && !!!users.length &&
          <TableBody>
            <TableRow>
              <TableCell>
                <Box sx={{
                  position: 'relative',
                  width: '100%',
                  height: '200px'
                }}>
                  <Loader/>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
          }
          {!loading && !!!users.length &&
          <TableBody>
            <TableRow>
              <TableCell align={'center'}>
                <Typography variant={'subtitle2'}>
                  Nothing found
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
          }
          {!!users.length &&
          <>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={handleToggleAll}
                  />
                </TableCell>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const isSelected = selected.includes(user.id);
                
                return (
                  <TableRow
                    hover
                    key={user.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const {checked} = event.target;
                          
                          if (checked) {
                            selectOne(user.id);
                          } else {
                            deselectOne(user.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>
                      {user.id}
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                      >
                        <Avatar
                          src={user.avatar}
                          sx={{
                            height: 42,
                            width: 42
                          }}
                        >
                          {user.name}
                        </Avatar>
                        <div>
                          <Link
                            color="inherit"
                            component={NextLink}
                            href={`${paths.users.index}/${user.id}`}
                            variant="subtitle2"
                          >
                            {user.name}
                          </Link>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                          >
                            {user.email}
                          </Typography>
                        </div>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          textTransform: 'capitalize',
                          color: (user.status === 'active') ? 'success.main' : 'error.main'
                        }}
                      >
                        {user.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={user.status === 'active' ? 'Block' : 'Unblock'}>
                        <IconButton
                          onClick={() => {
                            handleDialogOpen(user)
                          }}
                        >
                          <SvgIcon color={user.status === 'blocked' ? 'success' : 'error'}>
                            {user.status === 'blocked' ? <CheckCircleOutlined/> : <Block/>}
                          </SvgIcon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={'Edit'}>
                        <IconButton
                          component={NextLink}
                          href={`${paths.users.index}/${user.id}`}
                        >
                          <SvgIcon color={'primary'}>
                            <EditOutlined/>
                          </SvgIcon>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </>
          }
        </Table>
      </Scrollbar>
      <Pagination limit={limit} total={total} page={page} onPageChange={onPageChange} onLimitChange={handleLimitChange}/>
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
          {dialog.user && (dialog.user?.status === 'active' ? `Block user #${dialog.user?.id}?` : `Unblock user #${dialog.user?.id}?`)}
        </DialogTitle>
        <DialogContent dividers>
          {dialog.user && 'User '} {dialog.user && dialog.user?.name + ' | ' + dialog.user?.email}
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
            onClick={()=>{
              handleStatus(dialog.user?.id, dialog.user?.status, ()=>{
                handleDialogClose()
              })
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

UserListTable.propTypes = {
  users: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  handleLimitChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
};
