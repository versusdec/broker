import Head from 'next/head';
import {useRouter, useSearchParams} from 'next/navigation';
import NextLink from 'next/link';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import Generator from 'generate-password'
import {
  Box,
  Button,
  FormHelperText, IconButton, InputAdornment,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import {Layout as AuthLayout} from '../../../layouts/auth';
import {paths} from '../../../navigation/paths';
import {useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Input} from "../../../components/input";

const useParams = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || undefined;
  
  return {
    returnTo
  };
};

const initialValues = {
  email: '',
  name: '',
  password: '',
  confirm_password: '',
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
  confirm_password: Yup
    .string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .max(255)
    .required('Password is required'),
  phone: Yup
    .string()
    .min(7)
    .max(15),
  company: Yup
    .string()
  
});

const Page = () => {
  const router = useRouter();
  const {returnTo} = useParams();
  const [showPass, setShowPass] = useState(false);
  
  const generatePassword = () => {
    const pass = Generator.generate({
      numbers: true,
      symbols: true
    })
    formik.setFieldValue('password', pass).then(()=>{formik.setFieldTouched('password', true, true)})
    formik.setFieldValue('confirm_password', pass).then(()=>{formik.setFieldTouched('confirm_password', true, true)})
  }
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // register here
        console.log(values)
        
        router.push(returnTo || paths.index);
        
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
      <Head>
        <title>
          Register
        </title>
      </Head>
      <div>
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
              InputProps={{ // <-- This is where the toggle button is added.
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
            <Button variant={'outlined'} onClick={generatePassword} size={'large'}>Generate password</Button>
            <Input
              fullWidth
              label="Phone number"
              name="phone"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.phone}
            />
            <Input
              fullWidth
              label="Company name"
              name="company"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.phone}
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

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
