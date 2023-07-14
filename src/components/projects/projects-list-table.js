import {useCallback, useState} from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {Block, CheckCircleOutlined, Close, DeleteOutlined, EditOutlined, UnarchiveOutlined} from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link, Stack,
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
    grants,
    isAdmin,
    ...other
  } = props;
  const [dialog, setDialog] = useState({open: false, project: null});
  const [hidden, setHidden] = useState(null);
  const editGrant = (isAdmin || grants.includes('projects.write'));
  
  const handleMouseOver = useCallback((i) => {
    setHidden(i)
  }, [])
  
  const handleMouseOut = useCallback(() => {
    setHidden(null)
  }, [])
  
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
                  Project title
                </TableCell>
                <TableCell>
                  Creation date
                </TableCell>
                {editGrant && <TableCell sx={{width: 300}}/>}
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, i) => {
                
                return (
                  <TableRow
                    hover
                    key={project.id}
                    onMouseOver={() => {
                      handleMouseOver(i)
                    }}
                    onMouseOut={handleMouseOut}
                    height={72}
                  >
                    <TableCell>
                      {project.id}
                    </TableCell>
                    <TableCell>
                      {project.name}
                    </TableCell>
                    <TableCell>
                      {format(project.created * 1000, 'dd/MM/yyyy hh:mm')}
                    </TableCell>
                    <TableCell>
                      <Box hidden={hidden !== i}>
                        <Stack direction={'row'} spacing={1} justifyContent={'end'}>
                          <Button
                            variant={'contained'}
                            component={NextLink}
                            href={'#'}
                            sx={{mr: 2}}
                          >
                            Go to Project
                          </Button>
                          {editGrant && <>
                            <Tooltip title={'Edit'}>
                              <IconButton
                                component={NextLink}
                                href={`/${project.id}`}
                              >
                                <SvgIcon sx={{
                                  ':hover': {color: 'primary.main'}
                                }} fontSize={'small'}>
                                  <EditOutlined/>
                                </SvgIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={project.status === 'active' ? 'Archive' : 'Unarchive'}>
                              <IconButton
                                onClick={() => {
                                  handleDialogOpen(project)
                                }}
                              >
                                <SvgIcon sx={{
                                  ':hover': {color: 'primary.main'}
                                }} fontSize={'small'}>
                                  {project.status === 'archived' ? <UnarchiveOutlined/> : <DeleteOutlined/>}
                                </SvgIcon>
                              </IconButton>
                            </Tooltip>
                          </>}
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
