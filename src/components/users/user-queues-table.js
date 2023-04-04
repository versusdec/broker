import {useCallback, useEffect, useMemo, useState} from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {Block, CheckCircleOutlined, EditOutlined} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
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


export const QueuesListTable = (props) => {
  const {
    queues,
    total,
    onPageChange,
    handleLimitChange,
    page,
    limit,
    loading,
    ...other
  } = props;
  
  return (
    <Box
      sx={{position: 'relative'}}
      {...other}>
      
      <Scrollbar>
        <Table sx={{minWidth: 700}}>
          {loading && !!!queues.length &&
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
          {!loading && !!!queues.length &&
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
          {!!queues.length &&
          <>
            <TableHead>
              <TableRow>
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
              {queues.map((queue) => {
                
                return (
                  <TableRow
                    hover
                    key={queue.id}
                  >
                    <TableCell>
                      {queue.id}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={queue.status === 'active' ? 'Block' : 'Unblock'}>
                        <IconButton
                          onClick={() => {
                          }}
                        >
                          <SvgIcon color={queue.status === 'blocked' ? 'success' : 'error'}>
                            {queue.status === 'blocked' ? <CheckCircleOutlined/> : <Block/>}
                          </SvgIcon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={'Edit'}>
                        <IconButton
                          component={NextLink}
                          href={`${paths.users.index}/${queue.id}`}
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
    </Box>
  );
};

QueuesListTable.propTypes = {
  users: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  handleLimitChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
};
