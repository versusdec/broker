import {useCallback, useState} from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {Close, DeleteOutlined, EditOutlined, UnarchiveOutlined} from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow, Tooltip,
  Typography
} from '@mui/material';
import {Scrollbar} from '../scrollbar';
import {Pagination} from "../pagination";
import {Loader} from "../loader";
import {format} from 'date-fns';
import {paths} from "../../navigation/paths";

export const TicketsListTable = (props) => {
  const {
    total,
    onPageChange,
    handleLimitChange,
    page,
    limit,
    loading,
    handleStatus,
    tickets,
    ...other
  } = props;
  const [dialog, setDialog] = useState({open: false, project: null});
  
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
  
  return (
    <Box
      sx={{position: 'relative'}}
      {...other}>
      <Scrollbar>
        <Table sx={{minWidth: 700}}>
          {loading && !!!tickets.length &&
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
          {!loading && !!!tickets.length &&
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
          {!!tickets.length &&
          <>
            <TableHead>
              <TableRow>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  Project title
                </TableCell>
                <TableCell>
                  Creation date
                </TableCell>
                <TableCell sx={{width: 100}}/>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((item, i) => {
                
                return (
                  <TableRow
                    hover
                    key={item.id}
                  >
                    <TableCell>
                      {item.id}
                    </TableCell>
                    <TableCell>
                      {item.name}
                    </TableCell>
                    <TableCell>
                      {format(item.created * 1000, 'dd/MM/yyyy hh:mm')}
                    </TableCell>
                    <TableCell>
                      <Box hidden={hidden !== i}>
                        <Stack direction={'row'} spacing={1} justifyContent={'end'}>
                          
                            <Tooltip title={'Edit'}>
                              <IconButton
                                component={NextLink}
                                href={`${paths.support.index + item.id}/`}
                              >
                                <SvgIcon sx={{
                                  ':hover': {color: 'primary.main'}
                                }} fontSize={'small'}>
                                  <EditOutlined/>
                                </SvgIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={item.status === 'active' ? 'Archive' : 'Unarchive'}>
                              <IconButton
                                onClick={() => {
                                  handleDialogOpen(item)
                                }}
                              >
                                <SvgIcon sx={{
                                  ':hover': {color: 'primary.main'}
                                }} fontSize={'small'}>
                                  {item.status === 'archived' ? <UnarchiveOutlined/> : <DeleteOutlined/>}
                                </SvgIcon>
                              </IconButton>
                            </Tooltip>
                      
                        </Stack>
                      </Box>
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
          {dialog.item && (dialog.item?.status === 'active' ? `Archive project #${dialog.item?.id}?` : `Unarchive project #${dialog.item?.id}?`)}
        </DialogTitle>
        <DialogContent dividers>
          {dialog.item && 'Project '} {dialog.item && dialog.item?.name}
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
              handleStatus(dialog.item?.id, dialog.item?.status, () => {
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

TicketsListTable.propTypes = {
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  handleLimitChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
};
