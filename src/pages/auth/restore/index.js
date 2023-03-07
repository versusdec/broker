import {useRouter, useSearchParams} from 'next/navigation';
import NextLink from 'next/link';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {
  Box,
  Button,
  Stack,
  Link,
  Typography
} from '@mui/material';
import {Layout as AuthLayout} from '../../../layouts/auth';
import {paths} from '../../../navigation/paths';
import {Loader} from '../../../components/loader';
import {Input} from "../../../components/input";
import {useAuth} from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import {useEffect} from "react";

const initialValues = {
  password: '',
  password_confirm: '',
  token: ''
};

const validationSchema = Yup.object({
  password: Yup
    .string()
    .min(8)
    .max(255)
    .required('Password is required'),
  password_confirm: Yup
    .string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .max(255)
    .required('Password is required')
});

const useParams = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('t') || undefined;
  
  return {
    token
  };
};

const Page = () => {
  const router = useRouter();
  const {token} = useParams();
  initialValues.token = token;
  const {loading, error, password} = useAuth();
  
  useEffect(() => {
    error
      ? toast.error(error.message ? error.message
      : 'En error has occurred') : void 0;
  }, [error])
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, helpers) => {
      try {
        if (token) {
          values.token = token;
          const res = password(values)
          console.log(res);
          if(!res.error){
            router.push(paths.login);
          } else {
            toast.error('Something went wrong')
          }
        } else {
          toast.error('Invalid token')
        }
        
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
        {loading && <Loader/>}
        <Stack
          sx={{mb: 4}}
          spacing={1}
        >
          <Typography variant="h5">
            Reset password
          </Typography>
        </Stack>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Stack spacing={3}>
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
          <Box sx={{mt: 3}}>
            <Typography
              color="text.secondary"
              variant={'body2'}>
              <Link
                component={NextLink}
                href={paths.forgot}
                underline="hover"
                variant="subtitle2"
              >
                Resend email
              </Link>
            </Typography>
          </Box>
        </form>
      </div>
    </>
  );
};

Page.defaultProps = {
  title: 'Restore'
}

Page.getLayout = (page) => (
  <>
    <AuthLayout>
      {page}
    </AuthLayout>
  </>
);

export default Page;
