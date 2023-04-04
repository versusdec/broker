import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {Block, CheckCircleOutlined, Close, EditOutlined} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button, Card, CardContent,
  Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment,
  Link, OutlinedInput,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow, TextField, Tooltip,
  Typography,
  Autocomplete, MenuItem
} from '@mui/material';
import {Scrollbar} from '../scrollbar';
import {paths} from '../../navigation/paths';
import {Pagination} from "../pagination";
import {Loader} from "../loader";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {useUsers} from "../../hooks/useUsers";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import {Input} from "../input";
import {api} from "../../api";
import * as Yup from "yup";
import {useFormik, Form} from "formik";
import {usePagination} from "../../hooks/usePagination";
import {wait} from "../../utils/wait";

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
      value: Yup.string().required('Value is required')
    }))
});

const Options = ({items, formik}) => {
  const OptionsJSX = items.map((item, index) => {
    
    return false
  })
  
  return OptionsJSX;
}

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
    handleAutocomplete,
    ...other
  } = props;
  
  const [dialog, setDialog] = useState({
    open: false, item: {
      type: "select",
      label: "",
      project_id: projectId,
      name: "",
      options: [{value: "sraka"}, {value: "zhopa"}]
    }, edit: false
  });
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [fields, setFields] = useState([]);
  const [fieldValue, setFieldValue] = useState('');
  const [value, setValue] = useState({name: ''});
  
  const handleDialogClose = useCallback(() => {
    setDialog({
      open: false,
      item: {
        "type": "string",
        "label": "",
        "project_id": projectId,
        "name": "",
      },
      edit: false,
    })
  }, []);
  
  const handleAddDialog = useCallback(() => {
    setDialog(prev => {
      return {
        ...prev, open: true
      }
    })
  }, [])
  
  const suggestFields = useCallback(async (q) => {
    const res = await api.fields.suggest({q: q})
    if (res.result) {
      setFields(res.result.items)
    }
  }, [])
  
  useEffect(() => {
    if (fieldValue !== '') {
      suggestFields(fieldValue)
    }
  }, [fieldValue]);
  
  const initialValues = useMemo(() => (dialog.item), [dialog])
  
  const formik = useFormik({
    // enableReinitialize: true,
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: (values, helpers) => {
      try {
        console.log(values);
        /*handleAdd(values, () => {
          handleDialogClose()
        });*/
        
      } catch (err) {
        console.error(err);
        
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  })
  
  return (
    <Card>
      <Box
        sx={{position: 'relative'}}
        {...other}>
        <Stack
          alignItems="center"
          direction="row"
          spacing={3}
          sx={{p: 3}}
        >
          <Box
            sx={{flexGrow: 1}}
          >
            <Autocomplete
              open={autocompleteOpen}
              onOpen={() => {
                setAutocompleteOpen(true);
              }}
              onClose={() => {
                setAutocompleteOpen(false);
              }}
              onChange={(event, newValue) => {
                setValue({name: ''})
                handleAutocomplete(newValue)
              }}
              value={value}
              onInputChange={(event, newInputValue) => {
                setFieldValue(newInputValue);
              }}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              options={fields}
              size={'large'}
              filterOptions={(x) => x}
              // autoComplete
              // filterSelectedOptions
              noOptionsText={'Nothing found'}
              renderOption={(props, option) => {
                return <MenuItem {...props} key={option.id}>{option.name}</MenuItem>
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size={'small'}
                  InputLabelProps={{
                    sx: {
                      marginTop: '-5px'
                    }
                  }}
                  label={'Search fields'}
                />
              )}
            />
          </Box>
          <Button
            onClick={handleAddDialog}
            size={'large'}
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
                        {item.name}
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
                              handleDialogOpen(item)
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
                              handleEdit(item)
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
            <form noValidate>
              <Stack spacing={3}>
                <Input
                  fullWidth
                  label="Name"
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
                  label="Label"
                  name="label"
                  type="text"
                  error={!!(formik.touched.label && formik.errors.label)}
                  helperText={formik.touched.label && formik.errors.label}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
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
                  <Typography variant={'subtitle2'}>Options</Typography>
                  {/*<Options items={formik.values.options} formik={formik} />*/}
                  {formik.values.options.map((item, index) => (
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={3}
                      key={item.value + index}>
                      <Input name={`options[${index}].value`}
                             fullWidth
                             value={formik.values.options[index].value}
                             label={'Value'}
                             type={'text'}
                             error={!!(formik.touched.options && Boolean(formik.touched.options[index]) && Boolean(formik.errors.options?.[index]) && formik.errors.options?.[index].value)}
                             helperText={formik.touched.options && Boolean(formik.touched.options[index]) && Boolean(formik.errors.options?.[index]) && formik.errors.options?.[index].value}
                             onBlur={formik.handleBlur}
                             onChange={(e) => {
                               formik.setFieldValue(`options[${index}].value`, e.currentTarget.value)
                             }}
                      />
                      <Button>asd</Button>
                    </Stack>
                  ))}
                </>}
              </Stack>
            </form>
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
        </Dialog>
      </Box>
    </Card>
  );
};
