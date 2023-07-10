import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions, AppBar, Toolbar, SvgIcon, Divider, Paper
} from '@mui/material';
import {Button} from '../button';
import * as Yup from "yup";
import {ArrowBack, Circle, Close, ContentCopy, Visibility, VisibilityOff} from "@mui/icons-material";
import {useFormik} from "formik";
import toast from "react-hot-toast";
import {api} from "../../api";
import {Input} from "../input";
import {Loader} from "../loader";
import {actions} from "../../slices/usersSlice";
import {useDispatch} from "../../store";

const initialValues = {
  old_password: '',
  password: '',
  confirm_password: ''
};

const validationSchema = Yup.object({
  old_password: Yup
    .string()
    .max(255)
    .required('Enter old password'),
  password: Yup
    .string()
    .min(8)
    .max(255)
    .required('Password is required'),
  confirm_password: Yup
    .string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .max(255)
    .required('Password is required')
});


export const AccountSecuritySettings = ({user, isAdmin, editGrant, ...props}) => {
  const [showPass, setShowPass] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [newPassDisabled, setNewPassDisabled] = useState(true);
  const [twa, setTwa] = useState(user.twofa.status === 'enabled');
  const [key, setKey] = useState('');
  const [code, setCode] = useState('');
  const [dialog, setDialog] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [showTwofaPass, setShowTwofaPass] = useState(false);
  const [twofaPass, setTwofaPass] = useState('');
  const [step, setStep] = useState(0);
  const {onUpdate} = props;
  const isDisabled = !(isAdmin || editGrant);
  const ref = useRef(null);
  const dispatch = useDispatch();
  
  const handleTwaStatus = useCallback(async (code, status) => {
    const {result, error} = api.users.status2fa({code: code, status: status})
    return {result, error}
  }, [])
  
  const disableTwofa = useCallback(async () => {
    const {result, error} = await api.users.status2fa({code: code, status: 'disabled'})
    if (result) {
      const {result} = api.users.me()
      dispatch(actions.fillMe(result))
      setTwa(false)
      setConfirm(false)
    }
    if (error) toast.error(error.message)
  }, []);
  
  const activateTwa = useCallback(async () => {
    let code = '';
    ref.current.querySelectorAll('input').forEach(i => {
      code += i.value
    })
    const {result, error} = handleTwaStatus(code, 'enabled')
    
    if (result) {
      const {result} = api.users.me()
      dispatch(actions.fillMe(result))
    } else if (error) {
      toast.error(error.message)
    }
  }, [ref, user])
  
  const handleTwa = useCallback(() => {
    if (!twa) {
      setDialog(true)
    } else {
      setConfirm(true)
    }
  }, [twa, user, onUpdate])
  
  useEffect(() => {
    const fetch = async () => {
      const {result, error} = await api.users.qr({size: 300})
      if (result)
        setKey(result)
      else if (error)
        toast.error(error)
    }
    if (step === 1) fetch()
  }, [step])
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        if (values.password !== user.password) {
          toast.error('You entered wrong password')
        } else {
          onUpdate(values)
        }
      } catch (err) {
        console.error(err);
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  });
  
  useEffect(() => {
    if (formik.values.old_password.length > 7)
      setNewPassDisabled(false)
    if (formik.values.password.length > 7 && formik.values.confirm_password > 7)
      setDisabled(false)
    else setDisabled(true)
  }, [formik])
  
  return (
    <Stack spacing={4}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack
                spacing={3}
              >
                <Typography variant="h6">
                  Change password
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.old_password && formik.errors.old_password)}
                    fullWidth
                    helperText={formik.touched.old_password && formik.errors.old_password}
                    label="Password"
                    name="old_password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={showPass ? 'text' : 'password'}
                    value={formik.values.old_password}
                    disabled={isDisabled}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setShowPass(!showPass)
                            }}
                            color={'primary'}
                          >
                            {showPass ? <Visibility/> : <VisibilityOff/>}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="New password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                    disabled={isDisabled || newPassDisabled}
                  />
                  <TextField
                    error={!!(formik.touched.confirm_password && formik.errors.confirm_password)}
                    fullWidth
                    helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                    label="Confirm password"
                    name="confirm_password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.confirm_password}
                    disabled={isDisabled || newPassDisabled}
                  />
                  <Stack justifyContent={'start'} direction={'row'} spacing={2}>
                    <Button
                      disabled={disabled}
                      onClick={(e) => {
                        setDisabled(true);
                        setTimeout(() => {
                          setDisabled(false)
                        }, 500)
                        formik.handleSubmit(e)
                      }}
                    >Change Password</Button>
                    <Button
                      variant={'text'}
                      onClick={(e) => {
                      
                      }}
                    >Forgot password?</Button>
                  
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack spacing={2} direction={'row'} alignItems={'center'}>
                    <Typography variant="h6">Two Factor Authentication</Typography>
                    {!twa && <Alert severity={'error'} icon={false} sx={{
                      '.MuiAlert-message': {padding: 0}
                    }}>
                      <Typography color={'error'}>Disabled</Typography>
                    </Alert>}
                    {twa && <Alert severity={'success'} icon={false} sx={{
                      '.MuiAlert-message': {padding: 0}
                    }}>
                      <Typography color={'success'}>Enabled</Typography>
                    </Alert>}
                  </Stack>
                  <Typography
                    color="text.secondary"
                    variant="body2">
                    Use an authenticator app to scan generated QR code.
                  </Typography>
                  <Box>
                    <Button
                      variant={twa ? "outlined" : "contained"}
                      color={twa ? 'error' : 'primary'}
                      onClick={handleTwa}
                    >
                      {!twa ? 'Enable Authentication' : 'Disable Authentication'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack spacing={2} direction={'row'} alignItems={'center'}>
                    <Typography variant="h6">Telegram Bot</Typography>
                    <Alert severity={'error'} icon={false} sx={{
                      '.MuiAlert-message': {padding: 0}
                    }}>
                      <Typography color={'error'}>Disabled</Typography>
                    </Alert>
                  </Stack>
                  <Typography
                    color="text.secondary"
                    variant="body2">
                    Use the Telegram Bot to generate one time security codes.
                  </Typography>
                  <Box>
                    <Button
                      variant={"contained"}
                    >
                      Connect to Telegram bot
                    </Button>
                  </Box>
                
                </Stack>
              </CardContent>
            </Card>
          
          </Stack>
        </Grid>
      </Grid>
      <Dialog
        open={confirm}
        onClose={() => {
          setConfirm(false)
        }}
        scroll={'paper'}
        maxWidth={'sm'}
        fullWidth
      >
        <DialogTitle sx={{pr: 10}}>
          <IconButton
            aria-label="close"
            onClick={() => {
              setConfirm(false)
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
          Disable Two Factor Authentication
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant={'h6'}>Enter 6 digit code from authentication app</Typography>
          <Input
            onChange={(e)=>{
              setCode(e.target.value)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type={'button'}
            variant={'outlined'}
            color={'error'}
            onClick={() => {
              setConfirm(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type={'button'}
            variant={'contained'}
            onClick={() => {
              disableTwofa()
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen
        open={dialog}
        onClose={() => {
          setDialog(false)
          setStep(0)
        }}
      >
        <AppBar sx={{position: 'relative'}}>
          <Toolbar>
            <Button
              startIcon={(<ArrowBack/>)}
              disabled={step === 0}
              onClick={() => {
                setStep(step - 1)
              }}
            >Back</Button>
            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
              Enable 2-Step Authentication
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setDialog(false)
                setStep(0)
                setTwofaPass('')
              }}
              aria-label="close"
            >
              <Close/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Stack p={5}>
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              {step === 0 && <>
                <Card>
                  <CardContent>
                    <Stack spacing={3}>
                      <Typography variant={'h6'}>Confirm your password</Typography>
                      <Input
                        fullWidth
                        label="Enter Your Current Password"
                        name="twofa_pass"
                        type={showTwofaPass ? 'text' : 'password'}
                        value={twofaPass}
                        onChange={(e) => {
                          setTwofaPass(e.target.value)
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                  setShowTwofaPass(!showTwofaPass)
                                }}
                                color={'primary'}
                              >
                                {showTwofaPass ? <Visibility/> : <VisibilityOff/>}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <Stack direction={'row'} spacing={2}>
                        <Button
                          variant={'contained'}
                          onClick={() => {
                            if (user.password === twofaPass) {
                              setStep(step + 1)
                            } else {
                              toast.error('You entered wrong password')
                            }
                          }}
                        >Confirm Password</Button>
                        <Button
                          variant={'text'}
                        >Forgot password</Button>
                      
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </>}
              {step === 1 && <>
                <Card>
                  <CardContent>
                    <Stack spacing={3}>
                      <Typography variant={'h6'}>Scan the QR code or Copy the Key</Typography>
                      
                      <Grid container spacing={3} p={0}>
                        <Grid xs={12} md={4}>
                          <Paper>
                            <Box p={2}>
                              {!!key.length && <img src={key} alt="" style={{width: '100%'}}/>}
                              {!key.length && <Box sx={{
                                width: '216px',
                                height: '216px',
                                position: 'relative'
                              }}>
                                <Loader/>
                              </Box>}
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid xs={12} md={8}>
                          <Paper sx={{height: '100%'}}>
                            <Stack alignItems={'center'} justifyContent={'center'} p={2} spacing={3} height={'100%'}>
                              <Typography variant={'h5'} sx={{wordBreak: 'break-all', textAlign: 'center'}}>{user.twofa.key}</Typography>
                              <Button
                                variant={'outlined'}
                                startIcon={(<ContentCopy/>)}
                                onClick={() => {
                                  navigator.clipboard.writeText(user.twofa.key)
                                  toast('Key has been copied to clipboard')
                                }}
                              >Copy the Key</Button>
                            </Stack>
                          </Paper>
                        </Grid>
                      </Grid>
                      <Stack direction={'row'} spacing={2} pl={1}>
                        <Button
                          variant={'contained'}
                          onClick={() => {
                            setStep(step + 1)
                          }}
                        >Enter the 6-digit code</Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </>}
              {step === 2 && <>
                <Card>
                  <CardContent>
                    <Stack spacing={3}>
                      <Typography variant={'h6'}>Copy and paste the 6-digit code</Typography>
                      <Stack direction={'row'} spacing={1} ref={ref}>
                        <TextField
                          sx={{
                            'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                              'WebkitAppearance': 'none'
                            },
                            'input': {
                              p: 1,
                              fontSize: 16,
                              width: 44,
                              height: 38,
                              textAlign: 'center',
                              textTransform: 'uppercase'
                            }
                          }}
                          onPaste={e => {
                            e.preventDefault();
                            const code = e.clipboardData.getData('Text')
                            const inputs = ref.current.querySelectorAll('input')
                            for (let i = 0; i < 6; i++) {
                              inputs[i].value = code[i]
                            }
                            e.target.blur()
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length === 1) {
                              const inputs = ref.current.querySelectorAll('input')
                              inputs[1].focus()
                            }
                          }}
                        />
                        <TextField
                          sx={{
                            'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                              'WebkitAppearance': 'none'
                            },
                            'input': {
                              p: 1,
                              fontSize: 16,
                              width: 44,
                              height: 38,
                              textAlign: 'center',
                              textTransform: 'uppercase'
                            }
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length === 1) {
                              const inputs = ref.current.querySelectorAll('input')
                              inputs[2].focus()
                            }
                            if (val.length === 0) {
                              const inputs = ref.current.querySelectorAll('input')
                              inputs[0].focus()
                            }
                          }}
                        />
                        <TextField
                          sx={{
                            'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                              'WebkitAppearance': 'none'
                            },
                            'input': {
                              p: 1,
                              fontSize: 16,
                              width: 44,
                              height: 38,
                              textAlign: 'center',
                              textTransform: 'uppercase'
                            }
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length === 1) {
                              const inputs = ref.current.querySelectorAll('input')
                              inputs[3].focus()
                            }
                            if (val.length === 0) {
                              const inputs = ref.current.querySelectorAll('input')
                              inputs[1].focus()
                            }
                          }}
                        />
                        <TextField
                          sx={{
                            'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                              'WebkitAppearance': 'none'
                            },
                            'input': {
                              p: 1,
                              fontSize: 16,
                              width: 44,
                              height: 38,
                              textAlign: 'center',
                              textTransform: 'uppercase'
                            }
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length === 1) {
                              const inputs = ref.current.querySelectorAll('input')
                              inputs[4].focus()
                            }
                            if (val.length === 0) {
                              const inputs = ref.current.querySelectorAll('input')
                              inputs[2].focus()
                            }
                          }}
                        />
                        <TextField
                          sx={{
                            'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                              'WebkitAppearance': 'none'
                            },
                            'input': {
                              p: 1,
                              fontSize: 16,
                              width: 44,
                              height: 38,
                              textAlign: 'center',
                              textTransform: 'uppercase'
                            }
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length === 1) {
                              const inputs = ref.current.querySelectorAll('input')
                              inputs[5].focus()
                            }
                            if (val.length === 0) {
                              const inputs = ref.current.querySelectorAll('input')
                              inputs[3].focus()
                            }
                          }}
                        />
                        <TextField
                          sx={{
                            'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                              'WebkitAppearance': 'none'
                            },
                            'input': {
                              p: 1,
                              fontSize: 16,
                              width: 44,
                              height: 38,
                              textAlign: 'center',
                              textTransform: 'uppercase'
                            }
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length >= 1) {
                              e.target.value = e.target.value[0]
                              e.target.blur()
                            }
                            if (val.length === 0) {
                              const inputs = ref.current.querySelectorAll('input')
                              inputs[4].focus()
                            }
                          }}
                        />
                      
                      </Stack>
                      <Stack direction={'row'} spacing={2}>
                        <Button
                          variant={'contained'}
                          onClick={() => {
                            activateTwa()
                          }}
                        >Confirm Code</Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </>}
              {step === 3 && <>
                <Card>
                  <CardContent>
                    <Stack spacing={3}>
                      <Typography variant={'h6'}>Confirm your password</Typography>
                      <Typography variant={'body2'}>Now when logging in from an unfamiliar device, we will ask for a login code.</Typography>
                      <Typography variant={'body2'} sx={{mt: '8px!important'}}>To change your contact information, open the Details Section in your Account.</Typography>
                      
                      <Stack direction={'row'} spacing={2}>
                        <Button
                          variant={'contained'}
                          onClick={() => {
                            setDialog(false)
                            setStep(0)
                          }}
                        >Done</Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </>}
            </Grid>
            <Grid xs={12} md={4}>
              <Stack spacing={1}>
                <Typography variant={'h6'} mt={3}>Instructions for enabling the 2-step authentication</Typography>
                <Stack spacing={2}>
                  <Stack spacing={2} direction={'row'}>
                    <Stack alignItems={'center'} spacing={1} pt={1} pl={1}>
                      <SvgIcon sx={{fontSize: '10px', color: step === 0 ? 'primary.main' : 'neutral.400'}}>
                        <Circle/>
                      </SvgIcon>
                      <Divider orientation={'vertical'} variant={'middle'}/>
                    </Stack>
                    <Box>
                      <Typography variant={'subtitle2'}>
                        Confirm your password
                      </Typography>
                      <Typography variant={'body2'} color={'neutral.500'}>
                        Confirm the password to start the process of enabling 2-factor authentication
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack spacing={2} direction={'row'} mt={0}>
                    <Stack alignItems={'center'} spacing={1} pt={1} pl={1}>
                      <SvgIcon sx={{fontSize: '10px', color: step === 1 ? 'primary.main' : 'neutral.400'}}>
                        <Circle/>
                      </SvgIcon>
                      <Divider orientation={'vertical'} variant={'middle'}/>
                    </Stack>
                    <Box>
                      <Typography variant={'subtitle2'}>
                        Scan the QR code or copy the key
                      </Typography>
                      <Typography variant={'body2'} color={'neutral.500'}>
                        Scan the QR code through the Google Authentiator app or copy the key and paste it into the authenticator app.
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack spacing={2} direction={'row'} mt={0}>
                    <Stack alignItems={'center'} spacing={1} pt={1} pl={1}>
                      <SvgIcon sx={{fontSize: '10px', color: step === 2 ? 'primary.main' : 'neutral.400'}}>
                        <Circle/>
                      </SvgIcon>
                    </Stack>
                    <Box>
                      <Typography variant={'subtitle2'}>
                        Copy and paste the 6-digit code
                      </Typography>
                      <Typography variant={'body2'} color={'neutral.500'}>
                        After scanning the QR code or entering the key in your authentication app, a 6-digit code will be generated. Copy and paste it into the required input field.
                      </Typography>
                    </Box>
                  </Stack>
                
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Dialog>
    </Stack>
  );
};
