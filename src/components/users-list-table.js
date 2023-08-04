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
  const editGrant = (isAdmin || grants.includes('users.write'))
  
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
                            href={`${paths.users.index}edit/${user.id}/`}
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
                          onChange={() => {
                            handleStatus(user.id, user.status)
                          }}
                        />
                      </Typography>
                    </TableCell>
                    {editGrant && <TableCell align="right">
                      <Tooltip title={'Edit'}>
                        <IconButton
                          component={NextLink}
                          href={`${paths.users.index}edit/${user.id}`}
                        >
                          <SvgIcon sx={{':hover': {color: 'primary.main'}}} fontSize={'small'}>
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
