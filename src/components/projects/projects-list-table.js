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

export const ProjectsListTable = (props) => {
  const {
    projects,
    total,
    onPageChange,
    handleLimitChange,
    page,
    limit,
    loading,
    handleStatus,
    grants, isAdmin,
    ...other
  } = props;
  const [dialog, setDialog] = useState({open: false, project: null});
  const editGrant = (isAdmin || grants.includes('projects.write'))
  
  const handleDialogOpen = useCallback((project) => {
    setDialog({
      open: true,
      project: project
    })
  }, [])
  
  const handleDialogClose = useCallback(() => {
    setDialog({
      open: false,
      project: null
    })
  }, [])
  
  return (
    <Box
      sx={{position: 'relative'}}
      {...other}>
      <Scrollbar>
        <Table sx={{minWidth: 700}}>
          {loading && !!!projects.length &&
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
          {!loading && !!!projects.length &&
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
          {!!projects.length &&
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
                {editGrant && <TableCell align="right">
                  Actions
                </TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => {
                
                return (
                  <TableRow
                    hover
                    key={project.id}
                  >
                    <TableCell>
                      {project.id}
                    </TableCell>
                    <TableCell>
                      {editGrant ? <Link color={'inherit'}
                             variant="subtitle2"
                             component={NextLink}
                             href={`/${project.id}`}
                      >
                        {project.name}
                      </Link> : project.name
                      }
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          textTransform: 'capitalize',
                          color: (project.status === 'active') ? 'success.main' : 'error.main'
                        }}
                      >
                        {project.status}
                      </Typography>
                    </TableCell>
                    {editGrant && <TableCell align="right">
                      <Tooltip title={project.status === 'active' ? 'Archive' : 'Unzip'}>
                        <IconButton
                          onClick={() => {
                            handleDialogOpen(project)
                          }}
                        >
                          <SvgIcon color={project.status === 'archived' ? 'success' : 'error'}>
                            {project.status === 'archived' ? <CheckCircleOutlined/> : <Block/>}
                          </SvgIcon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={'Edit'}>
                        <IconButton
                          component={NextLink}
                          href={`/${project.id}`}
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
          {dialog.project && (dialog.project?.status === 'active' ? `Archive project #${dialog.project?.id}?` : `Unzip project #${dialog.project?.id}?`)}
        </DialogTitle>
        <DialogContent dividers>
          {dialog.project && 'Project '} {dialog.project && dialog.project?.name}
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
              handleStatus(dialog.project?.id, dialog.project?.status, () => {
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

ProjectsListTable.propTypes = {
  projects: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  handleLimitChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
};
