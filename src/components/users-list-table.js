import {useCallback, useEffect, useMemo, useState} from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {Block, CheckCircleOutlined, Circle, Close, EditOutlined} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton,
  Link,
  Stack,
  SvgIcon, Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow, Tooltip,
  Typography
} from '@mui/material';
import {Scrollbar} from './scrollbar';
import {paths} from '../navigation/paths';
import {Pagination} from "./pagination";
import {Loader} from "./loader";

export const UsersListTable = (props) => {
  const {
    users,
    total,
    onPageChange,
    handleLimitChange,
    page,
    limit,
    loading,
    handleStatus,
    grants,
    isAdmin,
    ...other
  } = props;
  const [dialog, setDialog] = useState({open: false, user: null});
  const editGrant = (isAdmin || grants.includes('users.write'))
  
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
  
  return (
    <Box
      sx={{position: 'relative'}}
      {...other}>
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
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Role
                </TableCell>
                <TableCell>
                  Manager
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                {editGrant && <TableCell/>}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                
                return (
                  <TableRow
                    hover
                    key={user.id}
                  >
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
                        />
                        <div>
                          {editGrant ? <Link
                            color="inherit"
                            component={NextLink}
                            href={`${paths.users.index}/${user.id}`}
                            variant="subtitle2"
                          >
                            {user.name}
                          </Link> : user.name}
                          <Typography
                            color="text.secondary"
                            variant="body2"
                          >
                            {user.email}
                          </Typography>
                        </div>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{textTransform: 'capitalize'}}>
                      <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <SvgIcon sx={{
                          fontSize: 10,
                          color: user.role === 'manager' ? 'warning.main' : 'info.main'
                        }}>
                          <Circle/>
                        </SvgIcon>
                        <Box>{user.role}</Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                    
                    </TableCell>
                    <TableCell>
                      <Typography>
                        <Switch
                          checked={user.status === 'active'}
                          onChange={(e) => {
                            console.log(e.target.checked)
                          }}
                        />
                      </Typography>
                    </TableCell>
                    {editGrant && <TableCell align="right">
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
                          href={`${paths.users.index}/edit/${user.id}`}
                        >
                          <SvgIcon color={'primary'}>
                            <EditOutlined/>
                          </SvgIcon>
                        </IconButton>
                      </Tooltip>
                    </TableCell>}
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
            onClick={() => {
              handleStatus(dialog.user?.id, dialog.user?.status, () => {
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

UsersListTable.propTypes = {
  users: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  handleLimitChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
};
