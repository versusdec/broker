import * as Yup from 'yup';
import {useFormik} from 'formik';
import NextLink from 'next/link';
import {
  Box,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  Stack,
  Link,
  Typography
} from '@mui/material';
import {Layout as AuthLayout} from '../../../layouts/auth';
import {paths} from '../../../navigation/paths';
import {Loader} from '../../../components/loader';
import {Input} from "../../../components/input";
import toast from 'react-hot-toast';
import {useAuth} from "../../../hooks/useAuth";
import {useEffect, useState} from "react";
import {Close} from "@mui/icons-material";

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

const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleModal = () => {
    setModalOpen(true)
  }
  return {modalOpen, handleModal}
}

const Page = () => {
  const {loading, error, login, login2fa} = useAuth();
  const [tfaValues, setTfaValues] = useState({})
  const {modalOpen, handleModal} = useModal();
  
  useEffect(() => {
    error
      ? toast.error(error.message ? error.message
      : 'En error has occurred') : void 0;
  }, [error])
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const res = await login(values);

        if (res && res.method === 'login2fa') {
          setTfaValues(values);
          handleModal();
        }
      } catch (err) {
        console.error(err);
        
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  });
  
  const formik2fa = useFormik({
    initialValues: {
      code: ''
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Code is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        values = {
          ...values,
          ...tfaValues
        }
        login2fa(values);
      } catch (err) {
        console.error(err);
        
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  })
  
  
  return (
    <>
      <div>
        {loading && <Loader backdrop/>}
        <Dialog
          open={modalOpen}
          scroll={'paper'}
          maxWidth={'lg'}
        >
          <DialogTitle sx={{pr: 10}}>
            Enter Google Authenticator code
          </DialogTitle>
          <form
            noValidate
            onSubmit={formik2fa.handleSubmit}
          >
            <DialogContent dividers>
              <Input
                error={!!(formik2fa.touched.code && formik2fa.errors.code)}
                fullWidth
                helperText={formik2fa.touched.code && formik2fa.errors.code}
                label="Code"
                name="code"
                onBlur={formik2fa.handleBlur}
                onChange={formik2fa.handleChange}
                type="text"
                value={formik2fa.values.email}
                sx={{mb: 1}}
              />
            </DialogContent>
            <DialogActions>
              <Button
                size="large"
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
            </DialogActions>
          </form>
        </Dialog>
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
