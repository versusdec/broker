import {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {format} from 'date-fns';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import {
  Box,
  Card,
  CardContent,
  CardHeader, IconButton, InputAdornment,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import {Button} from '../button';
import * as Yup from "yup";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Input} from "../input";
import {useFormik} from "formik";
import {paths} from "../../navigation/paths";
import {useMe} from "../../hooks/useMe";
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


export const AccountSecuritySettings = (props) => {
  const user = useMe();
  const [showPass, setShowPass] = useState(false);
  const [twa, setTwa] = useState(user.twofa.status === 'enabled');
  const {onUpdate} = props;
  const [code, setCode] = useState('')
  
  const handleTwa = useCallback(() => {
    if (!twa) {
      setTwa(true)
    } else {
      const newValues = {...user, twofa: {status: 'disabled'}}
      onUpdate(newValues)
      setTwa(false)
    }
  }, [twa])
  
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
  
  
  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">
                Change password
              </Typography>
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={8}
            >
              <Stack
                spacing={3}
              >
                <Input
                  error={!!(formik.touched.old_password && formik.errors.old_password)}
                  fullWidth
                  helperText={formik.touched.old_password && formik.errors.old_password}
                  label="Password"
                  name="old_password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPass ? 'text' : 'password'}
                  value={formik.values.old_password}
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
                <Input
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="New password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <Input
                  error={!!(formik.touched.confirm_password && formik.errors.confirm_password)}
                  fullWidth
                  helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                  label="Confirm password"
                  name="confirm_password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.confirm_password}
                />
                <Stack justifyContent={'end'} direction={'row'}>
                  <Button onClick={formik.handleSubmit}>Save</Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Two Factor Authentication"/>
        <CardContent sx={{pt: 0}}>
          <Grid
            container
            spacing={4}
          >
            <Grid
              xs={12}
              sm={6}
            >
              <Card
                sx={{height: '100%'}}
                variant="outlined"
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'block',
                      position: 'relative'
                    }}
                  >
                    <Box
                      sx={{
                        '&::before': {
                          backgroundColor: twa ? 'success.main' : 'error.main',
                          borderRadius: '50%',
                          content: '""',
                          display: 'block',
                          height: 8,
                          left: 4,
                          position: 'absolute',
                          top: 7,
                          width: 8,
                          zIndex: 1
                        }
                      }}
                    >
                      <Typography
                        color={twa ? "success.main" : "error"}
                        sx={{pl: 3}}
                        variant="body2"
                      >
                        {twa ? 'On' : 'Off'}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{mt: 1}}
                    variant="subtitle2"
                  >
                    Google Authentication
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{mt: 1}}
                    variant="body2"
                  >
                    Use an authenticator app to scan generated QR code.
                  </Typography>
                  <Box sx={{mt: 4}}>
                    <Button
                      variant="outlined"
                      onClick={handleTwa}
                    >
                      {!twa ? 'Set Up' : 'Disable'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {twa &&
            <Grid
              sm={6}
              xs={12}
            >
              <Card
                sx={{height: '100%'}}
                variant="outlined"
              >
                <CardContent>
                  <Typography variant={'subtitle2'}>Scan code or type below code in your app</Typography>
                  {!!code.length && <img src={code} alt="" style={{width: '100%'}}/>}
                  <Typography variant={'body2'}>{user.twofa.key}</Typography>
                </CardContent>
              </Card>
            </Grid>
            }
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
