import * as Yup from 'yup';
import { useFormik } from 'formik';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Stack,
  Link,
  Typography, TextField
} from '@mui/material';
import { Layout as AuthLayout } from '../../../layouts/auth';
import { paths } from '../../../navigation/paths';
import toast from 'react-hot-toast';
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";

const initialValues = {
  email: '',
  password: ''
};

const validationSchema = Yup.object({
  email: Yup
    .string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required'),
  password: Yup
    .string()
    .max(255)
    .required('Password is required')
});

const Page = () => {
  const {error, login} = useAuth();
  
  useEffect(() => {
    error
      ? toast.error(error.message ? error.message
      : 'Something went wrong') : void 0;
  }, [error])
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const res = await login(values);
        
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
        <Stack
          sx={{mb: 4}}
          spacing={1}
        >
          <Typography variant="h5">
            Log in
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Don&apos;t have an account?
            &nbsp;
            <Link
              component={NextLink}
              href={paths.register}
              underline="hover"
              variant="subtitle2"
            >
              Register
            </Link>
          </Typography>
        </Stack>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Stack spacing={3}>
            <TextField
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
            <TextField
              error={!!(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
            />
          </Stack>
          <Button
            fullWidth
            sx={{mt: 3}}
            size="large"
            type="submit"
            variant="contained"
          >
            Continue
          </Button>
        </form>
        <Box sx={{mt: 3}}>
          <Link
            component={NextLink}
            href={paths.forgot}
            underline="hover"
            variant="subtitle2"
          >
            Forgot password?
          </Link>
        </Box>
      </div>
    </>
  );
};

Page.defaultProps = {
  title: 'Login'
}

Page.getLayout = (page) => (
  <>
    <AuthLayout>
      {page}
    </AuthLayout>
  </>
);

export default Page;
