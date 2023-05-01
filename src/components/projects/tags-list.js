import {useCallback, useMemo, useState} from 'react';
import {Block, CheckCircleOutlined, Close, DeleteOutlined, EditOutlined} from '@mui/icons-material'
import {MuiColorInput} from 'mui-color-input'
import {
  Avatar,
  Box,
  Button, Card, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow, Tooltip,
  Typography, MenuItem, Paper
} from '@mui/material';
import {Scrollbar} from '../scrollbar';
import {Pagination} from "../pagination";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {Input} from "../input";
import * as Yup from "yup";
import {useFormik} from "formik";
import {neutral} from "../../theme/colors";

const validationSchema = Yup.object({
  tag: Yup
    .string()
    .max(255)
    .required('Name is required'),
  styles: Yup
    .string(),
  color: Yup
    .string(),
});

const Tag = ({handleEditDialog, handleStatus, item}) => {
  
  return <Paper sx={{p: 1, background: item.styles || 'white', color: item.color || 'inherit'}}>
    <Stack spacing={1} direction={'row'} alignItems={'center'}>
      <Box>{item.tag}</Box>
      <Tooltip title={item.status === 'active' ? 'Remove' : 'Unzip'}>
        <IconButton size={'small'}
                    onClick={() => {
                      handleStatus(item.id, item.status === 'active' ? 'archived' : 'active')
                    }}
        >
          <DeleteOutlined fontSize={'small'} color={item.status === 'archived' ? 'success' : 'error'}/>
        </IconButton>
      </Tooltip>
      <Tooltip title={'Edit'}>
        <IconButton size={'small'}
                    onClick={() => {
                      handleEditDialog(item)
                    }}
        >
          <EditOutlined color={'primary'} fontSize={'small'}/>
        </IconButton>
      </Tooltip>
    </Stack>
  </Paper>
}

export const TagsList = (props) => {
  const {
    items,
    handleStatus,
    projectId,
    handleAdd,
    handleEdit,
    ...other
  } = props;
  
  const [dialog, setDialog] = useState({
    open: false, item: {
      project_id: projectId,
      tag: "",
      color: neutral[900],
      styles: "#FFFFFF",
    }, edit: false
  });
  
  const handleAddDialog = useCallback(() => {
    setDialog(prev => {
      return {
        ...prev, open: true
      }
    })
  }, [])
  
  const handleEditDialog = useCallback((item) => {
    setDialog(prev => {
      return {
        open: true, edit: true, item: item
      }
    })
  }, [])
  
  const initialValues = useMemo(() => (dialog.item), [dialog]);
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    errors: {},
    enableReinitialize: true,
    onSubmit: (values, helpers) => {
      try {
        dialog.edit ? handleEdit(values, handleDialogClose) : handleAdd(values, handleDialogClose);
      } catch (err) {
        console.error(err);
        
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  });
  
  const handleDialogClose = useCallback(() => {
    setDialog(prev => ({
        open: false,
        item: {
          project_id: projectId,
          tag: "",
          color: "",
          styles: "#FFFFFF",
        },
        edit: false,
      })
    );
    formik.setValues(initialValues, false)
  }, []);
  
  return (
    <Card>
      <Box
        sx={{position: 'relative'}}
        {...other}>
        <Stack
          alignItems="center"
          justifyContent="flex-end"
          direction="row"
          spacing={3}
          sx={{p: 3}}
        >
          <Button
            onClick={handleAddDialog}
            startIcon={(
              <SvgIcon>
                <PlusIcon/>
              </SvgIcon>
            )}
            variant="contained"
          >
            Add
          </Button>
        </Stack>
        <Scrollbar>
          <Stack direction={'row'} spacing={3}>
            {!items.length &&
            <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%'}} p={3}>
              <Typography variant={'subtitle2'}>
                Nothing found
              </Typography>
            </Box>
            }
            {!!items.length && <Stack p={3} pt={0} spacing={3} direction={'row'} flexWrap={'wrap'}>
              {
                items.map(item => {
                  return <Tag key={item.id} handleStatus={handleStatus} handleEditDialog={handleEditDialog} item={item}/>
                })
              }
            </Stack>}
          </Stack>
        </Scrollbar>
        <Dialog
          open={dialog.open}
          onClose={handleDialogClose}
          scroll={'paper'}
          maxWidth={'sm'}
          fullWidth
        >
          <form noValidate>
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
              {dialog.edit ? 'Edit tag' : 'Create tag'}
            </DialogTitle>
            <DialogContent dividers>
              
              <Stack spacing={3}>
                <Input
                  fullWidth
                  label="Name"
                  name="tag"
                  type="text"
                  error={!!(formik.touched.tag && formik.errors.tag)}
                  helperText={formik.touched.tag && formik.errors.tag}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.tag}
                />
                <Input
                  fullWidth
                  label="Text color"
                  name="color"
                  type="color"
                  error={!!(formik.touched.color && formik.errors.color)}
                  helperText={formik.touched.color && formik.errors.color}
                  onBlur={formik.handleBlur}
                  onChange={(c) => {
                    formik.setFieldValue('color', c)
                  }}
                  value={formik.values.color}
                />
                <Input
                  fullWidth
                  label="Style"
                  name="styles"
                  type="color"
                  error={!!(formik.touched.styles && formik.errors.styles)}
                  helperText={formik.touched.styles && formik.errors.styles}
                  onBlur={formik.handleBlur}
                  onChange={(c) => {
                    formik.setFieldValue('styles', c)
                  }}
                  value={formik.values.styles}
                />
              
              </Stack>
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
                onClick={formik.handleSubmit}
              >
                Confirm
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Card>
  );
};
