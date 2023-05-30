import {useCallback, useMemo, useState} from 'react';
import {Block, CheckCircleOutlined, Close, DeleteOutlined, EditOutlined} from '@mui/icons-material'
import {
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
  Typography, MenuItem
} from '@mui/material';
import {Scrollbar} from '../scrollbar';
import {Pagination} from "../pagination";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {Input} from "../input";
import * as Yup from "yup";
import {useFormik} from "formik";

const validationSchema = Yup.object({
  name: Yup
    .string()
    .max(255)
    .required('Name is required'),
  label: Yup
    .string()
    .max(255).required('Label is required'),
  type: Yup
    .string()
    .oneOf(['string', 'int', 'boolean', 'date', 'time', 'datetime', 'select']),
  options: Yup.array().of(
    Yup.object({
      value: Yup.string()
    }))
});

export const FieldsListTable = (props) => {
  const {
    items,
    limit,
    page,
    total,
    onPageChange,
    handleLimitChange,
    handleStatus,
    projectId,
    handleAdd,
    handleEdit,
    ...other
  } = props;
  
  const [dialog, setDialog] = useState({
    open: false, item: {
      type: "string",
      label: "",
      project_id: projectId,
      name: "",
      options: [{value: ""}]
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
    const i = {...item};
    if (!i.options)
      i.options = [{value: ""}];
    
    setDialog(prev => {
      return {
        open: true, edit: true, item: i
      }
    })
  }, [])
  
  const handleRemoveOption = useCallback((i) => {
    const options = [...dialog.item.options];
    options.splice(i, 1);
    setDialog((prev) => {
      return {
        ...prev,
        item: {
          ...prev.item,
          type: 'select',
          options: options
        }
      }
    })
  }, [dialog])
  
  const handleAddOption = useCallback((i) => {
    const options = [...dialog.item.options];
    options.push({value: ''})
    console.log(options);
    setDialog((prev) => {
      return {
        ...prev,
        item: {
          ...prev.item,
          type: 'select',
          options: options
        }
      }
    })
  }, [dialog])
  
  const handleOptionChange = useCallback((i, v) => {
    const options = [...dialog.item.options];
    options[i].value = v;
    setDialog((prev) => {
      return {
        ...prev,
        item: {
          ...prev.item,
          type: 'select',
          options: options
        }
      }
    })
  }, [dialog])
  
  const initialValues = useMemo(() => (dialog.item), [dialog]);
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    errors: {},
    enableReinitialize: true,
    onSubmit: (values, helpers) => {
      try {
        if (values.type === 'select') {
          values.options.forEach((option, i) => {
            option.id = i;
          })
        }
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
    setDialog(prev=>({
        open: false,
        item: {
          "type": "string",
          "label": "",
          "project_id": projectId,
          "name": "",
          "options": [{value: ""}]
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
          <Table sx={{minWidth: 700}}>
            {!!!items.length &&
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
                    Type
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
                        {item.label}
                      </TableCell>
                      <TableCell>
                        {item.type}
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
                      <TableCell align="right">
                        <Tooltip title={item.status === 'active' ? 'Archive' : 'Unzip'}>
                          <IconButton
                            onClick={() => {
                              handleStatus(item.id, item.status === 'active' ? 'archived' : 'active')
                            }}
                          >
                            <SvgIcon color={item.status === 'archived' ? 'success' : 'error'}>
                              {item.status === 'archived' ? <CheckCircleOutlined/> : <Block/>}
                            </SvgIcon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={'Edit'}>
                          <IconButton
                            onClick={() => {
                              handleEditDialog(item)
                            }}
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
              {dialog.edit ? 'Edit field' : 'Create field'}
            </DialogTitle>
            <DialogContent dividers>
              
              <Stack spacing={3}>
                <Input
                  fullWidth
                  label="Name"
                  name="label"
                  type="text"
                  error={!!(formik.touched.label && formik.errors.label)}
                  helperText={formik.touched.label && formik.errors.label}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.label}
                />
                <Input
                  fullWidth
                  label="Field"
                  name="name"
                  type="text"
                  error={!!(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <Input
                  fullWidth
                  label="Type"
                  name="type"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  value={formik.values.type}
                >
                  <MenuItem key={'string'} value={'string'}>
                    String
                  </MenuItem>
                  <MenuItem key={'int'} value={'int'}>
                    Integer
                  </MenuItem>
                  <MenuItem key={'boolean'} value={'boolean'}>
                    Boolean
                  </MenuItem>
                  <MenuItem key={'date'} value={'date'}>
                    Date
                  </MenuItem>
                  <MenuItem key={'time'} value={'time'}>
                    Time
                  </MenuItem>
                  <MenuItem key={'datetime'} value={'datetime'}>
                    Datetime
                  </MenuItem>
                  <MenuItem key={'select'} value={'select'}>
                    Select
                  </MenuItem>
                </Input>
                {formik.values.type === 'select' && <>
                  <Stack direction={'row'} spacing={3} alignItems={'center'} justifyContent={'space-between'}>
                    <Typography variant={'subtitle2'}>Options</Typography>
                    <Tooltip title="Add option">
                      <IconButton onClick={() => {
                        handleAddOption()
                      }} color={'primary'}
                      >
                        <PlusIcon/>
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  {formik.values.options.map((item, index) => (
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={3}
                      key={item.value + index}>
                      <Input name={`options[${index}].value`}
                             fullWidth
                             value={formik.values.options[index].value}
                             label={'Name'}
                             type={'text'}
                             error={!!(formik.touched.options && Boolean(formik.touched.options[index]) && Boolean(formik.errors.options?.[index]) && formik.errors.options?.[index].value)}
                             helperText={formik.touched.options && Boolean(formik.touched.options[index]) && Boolean(formik.errors.options?.[index]) && formik.errors.options?.[index].value}
                             onBlur={formik.handleBlur}
                             onChange={(e) => {
                               handleOptionChange(index, e.currentTarget.value)
                               formik.setFieldValue(`options[${index}].value`, e.currentTarget.value)
                             }}
                      />
                      <Tooltip title="Remove">
                        <span>
                          <IconButton onClick={() => {
                            handleRemoveOption(index)
                          }}
                                      disabled={dialog.item.options.length === 1}
                                      color={dialog.item.options.length !== 1 ? 'primary' : ''}
                          >
                            <DeleteOutlined/>
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  ))}
                </>}
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
