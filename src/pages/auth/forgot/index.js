import Head from 'next/head';
import {useRouter} from 'next/navigation';
import NextLink from 'next/link';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {
  Alert, Box,
  Button,
  Card,
  CardContent,
  CardHeader, Dialog, DialogActions, DialogContent, DialogTitle,
  FormHelperText, IconButton,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {Layout as AuthLayout} from '../../../layouts/auth';
import {paths} from '../../../navigation/paths';
import {Loader} from '../../../components/loader';
import {useState} from "react";
import {Close} from "@mui/icons-material";
import {Input} from "../../../components/input";

const initialValues = {
  email: ''
};

const validationSchema = Yup.object({
  email: Yup
    .string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required')
});

const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleModal = () => {
    setModalOpen(!modalOpen)
  }
  return {modalOpen, handleModal}
}

const Page = () => {
  const {modalOpen, handleModal} = useModal();
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, helpers) => {
      try {
        //login here
        // login(values);
  
        handleModal();
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
        {/*{isFetching && <Loader/>}*/}
        
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
            Password resetting
          </DialogTitle>
          <DialogContent dividers>
            To restore access, use the instructions sent to your email.
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
            <Link
              href={paths.login}
              underline="hover"
              variant="subtitle2"
            >
              Log in
            </Link>
          </Box>
        </form>
      </div>
    </>
  );
};

Page.defaultProps = {
  title: 'Forgot'
}

Page.getLayout = (page) => (
  <>
    <AuthLayout>
      {page}
    </AuthLayout>
  </>
);

export default Page;
