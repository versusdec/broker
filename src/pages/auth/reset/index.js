import Head from 'next/head';
import {useRouter, useSearchParams} from 'next/navigation';
import NextLink from 'next/link';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {
  Alert, Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormHelperText, Hidden,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {Layout as AuthLayout} from '../../../layouts/auth';
import {paths} from '../../../navigation/paths';
import {Loader} from '../../../components/loader';
import {Input} from "../../../components/input";

const initialValues = {
  password: '',
  confirm_password: '',
  token: ''
};

const validationSchema = Yup.object({
  password: Yup
    .string()
    .min(8)
    .max(255)
    .required('Password is required'),
  confirm_password: Yup
    .string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .max(255)
    .required('Password is required')
});

const useParams = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || undefined;
  
  return {
    token
  };
};

const Page = () => {
  const router = useRouter();
  const {token} = useParams();
  initialValues.token = token;
  // const {data, isFetching, error, login} = useLogin();
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, helpers) => {
      try {
        //login here
        // login(values);
        values.token = token;
        console.log(values);
        
        // router.push(paths.index);
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
      <Head>
        <title>
          Reset password
        </title>
      </Head>
      <div>
        {/*{isFetching && <Loader/>}*/}
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

Page.getLayout = (page) => (
  <>
    <AuthLayout>
      {page}
    </AuthLayout>
  </>
);

export default Page;
