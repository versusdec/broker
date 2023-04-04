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


const useSelectionModel = (users) => {
  const usersIds = useMemo(() => {
    return users.map((user) => users.id);
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
    ...other
  } = props;
  const {deselectAll, selectAll, deselectOne, selectOne, selected} = useSelectionModel(projects);
  const [dialog, setDialog] = useState({open: false, project: null});
  
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
  
  const handleToggleAll = useCallback((event) => {
    const {checked} = event.target;
    
    if (checked) {
      selectAll();
    } else {
      deselectAll();
    }
  }, [selectAll, deselectAll]);
  
  const selectedAll = selected.length === projects.length;
  const selectedSome = selected.length > 0 && selected.length < projects.length;
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
                {/*<TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={handleToggleAll}
                  />
                </TableCell>*/}
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
              {projects.map((project) => {
                const isSelected = selected.includes(project.id);
                
                return (
                  <TableRow
                    hover
                    key={project.id}
                    selected={isSelected}
                  >
                    {/*<TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const {checked} = event.target;
                          
                          if (checked) {
                            selectOne(project.id);
                          } else {
                            deselectOne(project.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>*/}
                    <TableCell>
                      {project.id}
                    </TableCell>
                    <TableCell>
                      {project.name}
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
                    <TableCell align="right">
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
                          href={`${paths.projects.index}/${project.id}`}
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
            onClick={()=>{
              handleStatus(dialog.project?.id, dialog.project?.status, ()=>{
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
