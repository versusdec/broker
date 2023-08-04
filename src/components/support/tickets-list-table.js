import {useCallback, useState} from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Close,
  DeleteOutlined,
  FileOpenOutlined,
  QuestionAnswerOutlined,
} from '@mui/icons-material'
import {
  Alert,
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
    handleClose,
    handleReopen,
    tickets,
    ...other
  } = props;
  const [dialog, setDialog] = useState({open: false, item: null, action: undefined});
  
  const handleDialogOpen = useCallback((item, action) => {
    setDialog({
      open: true,
      item: item,
      action: action
    })
  }, [])
  
  const handleDialogClose = useCallback(() => {
    setDialog({
      open: false,
      item: null,
      action: undefined
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
                  Title
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Messages
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
                      {item.title}
                    </TableCell>
                    <TableCell>
                      {format(item.created * 1000, 'dd/MM/yyyy hh:mm')}
                    </TableCell>
                    <TableCell>
                      {<Alert severity={item.status === 'archived' ? 'warning' : item.status === 'closed' ? 'info' : 'success'}
                              sx={{
                                '.MuiAlert-message': {padding: 0},
                                textTransform: 'capitalize',
                                width: 'fit-content'
                              }}
                              icon={false}
                      >
                        {item.status}
                      </Alert>}
                    </TableCell>
                    <TableCell>
                      {item.messages}
                    </TableCell>
                    <TableCell>
                      <Stack direction={'row'} spacing={1} justifyContent={'end'}>
                        <Tooltip title={'Open'}>
                          <IconButton
                            component={NextLink}
                            href={`${paths.support.index + item.id}/`}
                          >
                            <SvgIcon sx={{
                              ':hover': {color: 'primary.main'}
                            }} fontSize={'small'}>
                              <QuestionAnswerOutlined/>
                            </SvgIcon>
                          </IconButton>
                        </Tooltip>
                        {item.status === 'closed' && <Tooltip title={'Archive'}>
                          <IconButton
                            onClick={() => {
                              handleDialogOpen(item)
                            }}
                          >
                            <SvgIcon sx={{
                              ':hover': {color: 'primary.main'}
                            }} fontSize={'small'}>
                              <DeleteOutlined/>
                            </SvgIcon>
                          </IconButton>
                        </Tooltip>}
                        {item.status === 'active' && <Tooltip title={'Close'}>
                          <IconButton
                            onClick={() => {
                              handleDialogOpen(item)
                            }}
                          >
                            <SvgIcon sx={{
                              ':hover': {color: 'primary.main'}
                            }} fontSize={'small'}>
                              <Close/>
                            </SvgIcon>
                          </IconButton>
                        </Tooltip>}
                        {item.status === 'closed' && <Tooltip title={'Reopen'}>
                          <IconButton
                            onClick={() => {
                              handleDialogOpen(item)
                            }}
                          >
                            <SvgIcon sx={{
                              ':hover': {color: 'primary.main'}
                            }} fontSize={'small'}>
                              <FileOpenOutlined/>
                            </SvgIcon>
                          </IconButton>
                        </Tooltip>}
                      </Stack>
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
          Confirm action
        </DialogTitle>
        <DialogContent dividers>
          {dialog.item && dialog.action === 'archive' && `Archive ticket ${<Typography variant={'subtitle1'}>{dialog.item.name}</Typography>}?`}
          {dialog.item && dialog.action === 'close' && `Close ticket ${<Typography variant={'subtitle1'}>{dialog.item.name}</Typography>}?`}
          {dialog.item && dialog.action === 'reopen' && `Reopen ticket ${<Typography variant={'subtitle1'}>{dialog.item.name}</Typography>}?`}
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
              switch (dialog.action) {
                case 'archive':
                  handleStatus(dialog.item.id, () => {
                    handleDialogClose()
                  })
                  break;
                case 'close':
                  handleClose(dialog.item.id, () => {
                    handleDialogClose()
                  })
                  break;
                case 'reopen':
                  handleReopen(dialog.item.id, () => {
                    handleDialogClose()
                  })
                  break;
                default:
                  break;
              }
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
