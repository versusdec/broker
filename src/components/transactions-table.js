import {Autocomplete, Avatar, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Link, MenuItem, OutlinedInput, Stack, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography} from "@mui/material";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {format} from "date-fns"
import {Block, CheckCircleOutlined, Close, EditOutlined} from "@mui/icons-material";
import {useEffect, useState} from "react";
import * as Yup from "yup";
import {useFormik} from "formik";
import {Input} from "./input";
import {Scrollbar} from "./scrollbar";
import {Loader} from "./loader";
import NextLink from "next/link";
import {paths} from "../navigation/paths";
import {Pagination} from "./pagination";
import {usePagination} from "../hooks/usePagination";

const initialValues = {
  type: 100,
  amount: '',
  user_id: '',
  comment: ''
};

const validationSchema = Yup.object({
  type: Yup
    .number()
    .oneOf([100, 101])
    .required('Select type'),
  amount: Yup
    .number()
    .required('Enter amount'),
  comment: Yup
    .string()
});

export const TransactionsTable = ({onFiltersChange, transactions, dialogOpen, dialogClose, clients, onSubmit, isAdmin}) => {
  const [timestamp, setTimestamp] = useState(null)
  const [client, setClient] = useState(null)
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const {data, loading, error} = transactions;
  
  useEffect(() => {
    onFiltersChange({
      limit: limit, offset: offset
    })
  }, [limit, page, offset])
  
  useEffect(() => {
    if (clients)
      setClient(clients[0])
  }, [clients])
  
  useEffect(() => {
    timestamp?.start && timestamp?.end && onFiltersChange({timestamp: timestamp})
  }, [timestamp])
  
  const onClientChange = (client) => {
    setClient(client)
  }
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: (values, helpers) => {
      try {
        values.user_id = client.id;
        onSubmit(values)
      } catch (err) {
        console.error(err);
        
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  })
  
  
  return <>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={3}
        sx={{p: 3}}
      >
        <DatePicker label="From" onChange={val => {
          setTimestamp(prev => ({
            ...prev,
            start: Math.floor(val.getTime() / 1000)
          }))
        }}/>
        <DatePicker label="To" onChange={val => {
          setTimestamp(prev => ({
            ...prev,
            end: Math.floor(val.getTime() / 1000)
          }))
        }}/>
      
      </Stack>
    </LocalizationProvider>
    <Box
      sx={{position: 'relative'}}>
      <Scrollbar>
        <Table sx={{minWidth: 700}}>
          {loading && !!!data?.items?.length &&
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
          {!loading && !!!data?.items.length &&
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
          {!!data?.items?.length &&
          <>
            <TableHead>
              <TableRow>
                <TableCell>
                  Date
                </TableCell>
                {isAdmin && <TableCell>User</TableCell>}
                <TableCell>
                  Amount
                </TableCell>
                <TableCell>
                  Type
                </TableCell>
                <TableCell>
                  Comment
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.items?.length && data.items.map((item) => {
                
                return (
                  <TableRow
                    hover
                    key={item.id}
                  >
                    <TableCell>
                      {item.timestamp}
                    </TableCell>
                    
                    {isAdmin && <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                      >
                        <Avatar
                          src={item.user.avatar}
                          sx={{
                            height: 42,
                            width: 42
                          }}
                        />
                        <div>
                          <Link
                            color="inherit"
                            component={NextLink}
                            href={`${paths.users.index}/${item.user.id}`}
                            variant="subtitle2"
                          >
                            {item.user.name}
                          </Link>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                          >
                            {item.user.email}
                          </Typography>
                        </div>
                      </Stack>
                    </TableCell>}
                    <TableCell>
                      {item.amount}
                    </TableCell>
                    <TableCell>
                      {item.type === 100 ? 'Invoice' : 'Bonus'}
                    </TableCell>
                    <TableCell>
                      {item.comment}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </>
          }
        </Table>
      </Scrollbar>
      {data && <Pagination limit={limit} total={data.total} page={page} onPageChange={handlePageChange} onLimitChange={handleLimitChange}/>}
    </Box>
    <Dialog
      open={dialogOpen}
      onClose={dialogClose}
      scroll={'paper'}
      maxWidth={'sm'}
      fullWidth
    >
      <DialogTitle sx={{pr: 10}}>
        <IconButton
          aria-label="close"
          onClick={dialogClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.primary.main,
          }}
        >
          <Close/>
        </IconButton>
        Create Transaction
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Input
            fullWidth
            label="Type"
            name="type"
            onChange={formik.handleChange}
            select
            value={formik.values.type}
          >
            <MenuItem key={100} value={100}>
              Invoice
            </MenuItem>
            <MenuItem key={101} value={101}>
              Bonus
            </MenuItem>
          </Input>
          <Input
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            error={!!(formik.touched.amount && formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.amount}
          />
          {!!clients?.length && <Autocomplete
            disablePortal
            disableClearable
            options={clients}
            getOptionLabel={(i) => {
              return (i.name ? i.name + ' | ' : '') + i.email
            }}
            onChange={(e, val) => {
              onClientChange(val)
            }}
            value={client || clients[0] || null}
            renderInput={(params) => <TextField {...params}
                                                fullWidth
                                                name="client_id"
                                                label="Client"/>}
          />}
          <Input
            fullWidth
            label="Comment"
            name="comment"
            type="text"
            error={!!(formik.touched.comment && formik.errors.comment)}
            helperText={formik.touched.comment && formik.errors.comment}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.comment}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          type={'button'}
          variant={'outlined'}
          color={'error'}
          onClick={dialogClose}
        >
          Cancel
        </Button>
        <Button
          type={'button'}
          variant={'contained'}
          onClick={() => {
            formik.handleSubmit()
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </>
}