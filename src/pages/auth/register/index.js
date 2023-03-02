import NextLink from 'next/link';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import Generator from 'generate-password'
import {
  Box,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormHelperText, IconButton, InputAdornment,
  Link,
  Stack,
  Typography
} from '@mui/material';

import {Layout as AuthLayout} from '../../../layouts/auth';
import {paths} from '../../../navigation/paths';
import {useEffect, useState} from "react";
import {Close, Visibility, VisibilityOff} from "@mui/icons-material";
import {Input} from "../../../components/input";
import {useAuth} from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import {Loader} from "../../../components/loader";

const initialValues = {
  email: '',
  name: '',
  password: '',
  password_confirm: '',
  phone: '',
  company: ''
};

const validationSchema = Yup.object({
  email: Yup
    .string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required'),
  name: Yup
    .string()
    .max(255)
    .required('Name is required'),
  password: Yup
    .string()
    .min(8)
    .max(255)
    .required('Password is required'),
  password_confirm: Yup
    .string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .max(255)
    .required('Password is required'),
  phone: Yup
    .string(),
  company: Yup
    .string()
});

const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleModal = () => {
    setModalOpen(!modalOpen)
  }
  return {modalOpen, handleModal}
}

const Page = () => {
  const [showPass, setShowPass] = useState(false);
  const {loading, error, register} = useAuth();
  const {modalOpen, handleModal} = useModal();
  
  useEffect(() => {
    error
      ? toast.error(error.message ? error.message
      : 'En error has occurred') : void 0;
  }, [error])
  
  const generatePassword = () => {
    const pass = Generator.generate({
      numbers: true,
      symbols: true
    })
    formik.setFieldValue('password', pass).then(() => {
      formik.setFieldTouched('password', true, true)
    })
    formik.setFieldValue('password_confirm', pass).then(() => {
      formik.setFieldTouched('password_confirm', true, true)
    })
  }
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        if (values.phone?.length) {
          values.phone = values.phone.replace(/[^0-9]/g, '');
        }
        for(const key in values) {
          if( values[key] === '')
            delete values[key]
        }
        const res = await register(values);
        if (res) {
          handleModal()
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
    <>
      <div>
        {loading && <Loader/>}
        <Dialog
          open={modalOpen}
          onClose={handleModal}
          scroll={'paper'}
          maxWidth={'lg'}
        >
          <DialogTitle sx={{pr: 10}}>
            <IconButton
              aria-label="close"
              onClick={handleModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              <Close/>
            </IconButton>
            Registration confirm
          </DialogTitle>
          <DialogContent dividers>
            To complete your registration please check your email.
          </DialogContent>
          <DialogActions>
            <Button
              type={'button'}
              variant={'contained'}
              onClick={handleModal}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Stack
          sx={{mb: 4}}
          spacing={1}
        >
          <Typography variant={'h5'}>
            Register
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Already have an account?
            &nbsp;
            <Link
              component={NextLink}
              href={paths.login}
              underline="hover"
              variant="subtitle2"
            >
              Log in
            </Link>
          </Typography>
        </Stack>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Stack spacing={3}>
            <Input
              error={!!(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label="Name"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <Input
              error={!!(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
            />
            <Input
              error={!!(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type={showPass ? 'text' : 'password'}
              value={formik.values.password}
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
              error={!!(formik.touched.password_confirm && formik.errors.password_confirm)}
              fullWidth
              helperText={formik.touched.password_confirm && formik.errors.password_confirm}
              label="Confirm password"
              name="password_confirm"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password_confirm}
            />
            <Button variant={'outlined'} onClick={generatePassword} size={'large'}>Generate password</Button>
            <Input
              fullWidth
              label="Phone number"
              name="phone"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              
              type="tel"
              value={formik.values.phone}
            />
            <Input
              fullWidth
              label="Company name"
              name="company"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.company}
            />
          </Stack>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              ml: -1,
              mt: 1
            }}
          >
          </Box>
          {!!(formik.touched.policy && formik.errors.policy) && (
            <FormHelperText error>
              {formik.errors.policy}
            </FormHelperText>
          )}
          {formik.errors.submit && (
            <FormHelperText
              error
              sx={{mt: 3}}
            >
              {formik.errors.submit}
            </FormHelperText>
          )}
          <Button
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            sx={{mt: 2}}
            type="submit"
            variant="contained"
          >
            Register
          </Button>
        </form>
      </div>
    </>
  );
};

Page.defaultProps = {
  title: 'Register'
}

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
