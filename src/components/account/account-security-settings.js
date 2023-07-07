import {useCallback, useEffect, useState} from 'react';
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
  Alert
} from '@mui/material';
import {Button} from '../button';
import * as Yup from "yup";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useFormik} from "formik";
import toast from "react-hot-toast";
import {api} from "../../api";

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
  const [code, setCode] = useState('');
  const {onUpdate} = props;
  const isDisabled = !(isAdmin || editGrant);
  
  const handleTwa = useCallback(() => {
    if (!twa) {
      setTwa(true)
    } else {
      const newValues = {...user, twofa: {status: 'disabled'}}
      onUpdate(newValues)
      setTwa(false)
    }
  }, [twa, user, onUpdate])
  
  useEffect(() => {
    const fetch = async () => {
      const {result, error} = await api.users.qr({size: 300})
      if (result)
        setCode(result)
      else if (error)
        toast.error(error)
    }
    if (twa)
      fetch()
  }, [twa])
  
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
                  {twa &&
                  <Stack spacing={2}>
                    <Typography variant={'subtitle2'}>Scan code or type below code in your app</Typography>
                    <Typography variant={'body2'}>{user.twofa.key}</Typography>
                    {!!code.length && <img src={code} alt="" style={{width: '100%'}}/>}
                  </Stack>}
                  
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
    </Stack>
  );
};
