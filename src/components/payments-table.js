import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  MenuItem,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Menu,
  Alert
} from "@mui/material";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {format} from "date-fns"
import {ArrowDropDown, BlockOutlined, CheckCircleOutlined, Close, CreditCardOutlined, Done, Loop, Add, PrintOutlined} from "@mui/icons-material";
import {useCallback, useEffect, useState} from "react";
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
  type: 'invoice',
  amount: '',
  comment: ''
};

const validationSchema = Yup.object({
  type: Yup
    .string()
    .oneOf(['invoice', 'bonus'])
    .required('Select type'),
  amount: Yup
    .number()
    .required('Enter amount'),
  comment: Yup
    .string()
});

export const PaymentsTable = ({onFiltersChange, payments, dialogOpen, dialogClose, onSubmit, isAdmin, onPay, onCancel, filters}) => {
  const [timestamp, setTimestamp] = useState(null);
  const [confirmPay, setConfirmPay] = useState({item: null, open: false});
  const [confirmCancel, setConfirmCancel] = useState({item: null, open: false});
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const {data, loading} = payments;
  const [hidden, setHidden] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null);
  const periodOpen = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleMouseOver = useCallback((i) => {
    setHidden(i)
  }, [])
  
  const handleMouseOut = useCallback(() => {
    setHidden(null)
  }, [])
  
  useEffect(() => {
    onFiltersChange({
      limit: limit, offset: offset
    })
  }, [limit, page, offset, onFiltersChange])
  
  useEffect(() => {
    timestamp?.start && timestamp?.end && onFiltersChange({timestamp: timestamp})
  }, [timestamp, onFiltersChange])
  
  const getSeverity = useCallback(status => {
    return status === 'payed' ? 'success'
      : status === 'new' ? 'info'
        : status === 'pending' ? 'warning'
          : status === 'canceled' ? 'error' : ''
  }, [])
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: (values, helpers) => {
      try {
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
        <Button
          id={'period-button'}
          endIcon={<ArrowDropDown/>}
          variant={'outlined'}
          sx={{
            color: 'neutral.500',
            borderColor: 'neutral.200',
            height: 55,
            borderRadius: '8px',
            transition: 'none',
            pl: '12px',
            ':hover': {borderColor: 'neutral.200',}
          }}
          aria-controls={periodOpen ? 'period-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={periodOpen ? 'true' : undefined}
          onClick={handleClick}
        >
          Period
        </Button>
        <Menu
          id="period-menu"
          aria-labelledby="period-button"
          anchorEl={anchorEl}
          open={periodOpen}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        
        >
          <Box p={2}>
            <Box mb={2}>
              DATEPICKER HERE
            </Box>
            <Button
              onClick={handleClose}
              fullWidth
              variant={'contained'}
            >
              OK
            </Button>
          </Box>
        </Menu>
        <Input
          width={96}
          sx={{width: 96}}
          select
          value={filters.status ?? ''}
          label={'Status'}
          onChange={(e) => {
            if (e.target.value === '') delete filters.status
            const f = {...filters}
            e.target.value === '' ? void 0 : f.status = e.target.value
            onFiltersChange(f)
          }}
        >
          <MenuItem value={''}>All</MenuItem>
          <MenuItem value={'new'}>New</MenuItem>
          <MenuItem value={'payed'}>Paid</MenuItem>
          <MenuItem value={'pending'}>Pending</MenuItem>
          <MenuItem value={'canceled'}>Canceled</MenuItem>
        </Input>
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
                <TableCell sx={{whiteSpace: 'nowrap'}}>
                  Payment ID
                </TableCell>
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
                <TableCell>
                  Status
                </TableCell>
                <TableCell width/>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.items?.length && data.items.map((item, i) => {
                return (
                  <TableRow
                    hover
                    key={item.id}
                    onMouseOver={() => {
                      handleMouseOver(i)
                    }}
                    onMouseOut={handleMouseOut}
                  >
                    <TableCell>{item.id}</TableCell>
                    <TableCell sx={{whiteSpace: 'nowrap'}}>
                      {format(new Date(item.created * 1000), 'yyyy-MM-dd HH:mm:ss')}
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
                      ${item.amount}
                    </TableCell>
                    <TableCell>
                      {item.type === 100 ? 'Invoice' : 'Bonus'}
                    </TableCell>
                    <TableCell>
                      {item.comment}
                    </TableCell>
                    <TableCell>
                      <Box sx={{textTransform: 'capitalize'}}>
                        {<Alert severity={getSeverity(item.status)}
                                sx={{
                                  '.MuiAlert-message': {padding: 0},
                                  '.MuiAlert-icon': {mr: 1, fontSize: '10px'}
                                }}
                                iconMapping={{
                                  success: <SvgIcon fontSize={'10px'}>
                                    <Done sx={{fontSize: '10px'}}/>
                                  </SvgIcon>,
                                  info: <SvgIcon fontSize={'10px'}>
                                    <Add sx={{fontSize: '10px'}}/>
                                  </SvgIcon>,
                                  warning: <SvgIcon fontSize={'10px'}>
                                    <Loop sx={{fontSize: '10px'}}/>
                                  </SvgIcon>,
                                  error: <SvgIcon fontSize={'10px'}>
                                    <Close sx={{fontSize: '10px'}}/>
                                  </SvgIcon>
                                }}
                        >
                          {item.status}
                        </Alert>}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box hidden={false}>
                        <Stack direction={'row'} justifyContent={'end'}>
                          <Tooltip title="Pay">
                            <IconButton
                              onClick={() => {
                                setConfirmPay({item: item, open: true})
                              }}
                            >
                              <SvgIcon sx={{
                                ':hover': {color: 'primary.main'}
                              }}>
                                <CreditCardOutlined/>
                              </SvgIcon>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={'Cancel'}>
                            <IconButton onClick={() => {
                              setConfirmCancel({item: item, open: true})
                            }}>
                              <SvgIcon sx={{
                                ':hover': {color: 'error.main'}
                              }}>
                                <Close/>
                              </SvgIcon>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={'Print'}>
                            <IconButton onClick={() => {
                            
                            }}>
                              <SvgIcon sx={{
                                ':hover': {color: 'primary.main'}
                              }}>
                                <PrintOutlined/>
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
        Create Payment
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
            <MenuItem key={'invoice'} value={'invoice'}>
              Invoice
            </MenuItem>
            <MenuItem key={'bonus'} value={'bonus'}>
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
    <Dialog
      open={confirmPay.open}
      onClose={() => {
        setConfirmPay({item: null, open: false})
      }}
      scroll={'paper'}
      maxWidth={'sm'}
      fullWidth
    >
      <DialogTitle sx={{pr: 10}}>
        <IconButton
          aria-label="close"
          onClick={() => {
            setConfirmPay({item: null, open: false})
          }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.primary.main,
          }}
        >
          <Close/>
        </IconButton>
        Pay payment
      </DialogTitle>
      <DialogContent dividers>
        Pay this payment?
      </DialogContent>
      <DialogActions>
        <Button
          type={'button'}
          variant={'outlined'}
          color={'error'}
          onClick={() => {
            setConfirmPay({item: null, open: false})
          }}
        >
          Cancel
        </Button>
        <Button
          type={'button'}
          variant={'contained'}
          onClick={() => {
            onPay(confirmPay.item.id, () => {
              setConfirmPay({item: null, open: false})
            })
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog
      open={confirmCancel.open}
      onClose={() => {
        setConfirmCancel({item: null, open: false})
      }}
      scroll={'paper'}
      maxWidth={'sm'}
      fullWidth
    >
      <DialogTitle sx={{pr: 10}}>
        <IconButton
          aria-label="close"
          onClick={() => {
            setConfirmCancel({item: null, open: false})
          }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.primary.main,
          }}
        >
          <Close/>
        </IconButton>
        Cancel payment
      </DialogTitle>
      <DialogContent dividers>
        Cancel this payment?
      </DialogContent>
      <DialogActions>
        <Button
          type={'button'}
          variant={'outlined'}
          color={'error'}
          onClick={() => {
            setConfirmCancel({item: null, open: false})
          }}
        >
          Cancel
        </Button>
        <Button
          type={'button'}
          variant={'contained'}
          onClick={() => {
            onCancel(confirmCancel.item.id, () => {
              setConfirmCancel({item: null, open: false})
            })
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </>
}