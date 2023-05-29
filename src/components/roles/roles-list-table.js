import {useCallback, useState} from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {ArchiveOutlined, Close, EditOutlined, UnarchiveOutlined} from '@mui/icons-material'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Link, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography} from '@mui/material';
import {Scrollbar} from '../scrollbar';
import {paths} from '../../navigation/paths';
import {Pagination} from "../pagination";
import {Loader} from "../loader";
import {useMe} from "../../hooks/useMe";


export const RolesListTable = (props) => {
  const {
    items,
    total,
    onPageChange,
    handleLimitChange,
    page,
    limit,
    loading,
    handleStatus,
    ...other
  } = props;
  const [dialog, setDialog] = useState({open: false, item: null});
  const {data: {role_id}} = useMe()

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
          {loading && !!!items.length &&
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
          {!loading && !!!items.length &&
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
          {!!items.length &&
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
                Description
              </TableCell>
              <TableCell>
                Status
              </TableCell>
              {role_id === 0 && <TableCell align="right">
                Actions
              </TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              
              return (
                <TableRow
                  hover
                  key={item.id}
                >
                  <TableCell>
                    {item.id}
                  </TableCell>
                  <TableCell>
                    {role_id === 0 && <Link
                      color="inherit"
                      component={NextLink}
                      href={`${paths.roles.index}/${item.id}`}
                      variant="subtitle2"
                    >
                      {item.name}
                    </Link>}
                    {role_id !== 0 && item.name}
                  </TableCell>
                  <TableCell>
                    {item.description}
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        textTransform: 'capitalize',
                        color: (item.status === 'active') ? 'success.main' : 'error.main'
                      }}
                    >
                      {item.status}
                    </Typography>
                  </TableCell>
                  {role_id === 0 && <TableCell align="right">
                    <Tooltip title={item.status === 'active' ? 'Archive' : 'Unzip'}>
                      <IconButton
                        onClick={() => {
                          handleDialogOpen(item)
                        }}
                      >
                        <SvgIcon color={item.status === 'archived' ? 'success' : 'error'}>
                          {item.status === 'archived' ? <UnarchiveOutlined/> : <ArchiveOutlined/>}
                        </SvgIcon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={'Edit'}>
                      <IconButton
                        component={NextLink}
                        href={`${paths.roles.index}/${item.id}`}
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
          {dialog.item && (dialog.item?.status === 'active' ? `Archive role #${dialog.item?.id}?` : `Unzip role #${dialog.item?.id}?`)}
            </DialogTitle>
            <DialogContent dividers>
          {dialog.item && 'Role '} <Typography component={'span'} variant={'subtitle1'}>{dialog.item && dialog.item?.name}</Typography>
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

RolesListTable.propTypes = {
  items: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  handleLimitChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
};
