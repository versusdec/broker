import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider, IconButton, InputAdornment, MenuItem,
  Stack,
  SvgIcon,
  Switch,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import {alpha} from '@mui/material/styles';
import {Input} from "../input";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useCallback, useEffect, useMemo, useState} from "react";
import {FileUploader} from "../file-uploader";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const timezones = [
  {value: 1, label: '+1'},
  {value: 2, label: '+2'},
  {value: 3, label: '+3'},
]

const languageOptions = [
  {
    icon: '/assets/flags/flag-uk.svg',
    label: 'English',
    value: 'en'
  },
  {
    icon: '/assets/flags/flag-de.svg',
    label: 'German',
    value: 'de'
  },
  {
    icon: '/assets/flags/flag-es.svg',
    label: 'Spanish',
    value: 'es'
  }
]

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
  timezone: Yup
    .number()
    .oneOf([0, 1, 2, 3]),
  language: Yup
    .string()
    .oneOf(['en', 'de', 'es']),
  password: Yup
    .string()
    .min(8)
    .max(255),
  confirm_password: Yup
    .string()
    .max(255)
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .when("password", {
      is: (password) => password && password.length,
      then: Yup.string().required("Confirm your new password").max(255)
    }),
  status: Yup
    .string()
    .oneOf(['active', 'blocked'])
});

export const CommonTab = (props) => {
  const {user, onSubmit} = props;
  
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const handleOpen = useCallback(() => {
    setUploaderOpen(true)
  }, [])
  
  const handleClose = useCallback(() => {
    setUploaderOpen(false)
  }, [])
  
  const handleUploader = () => {
    setUploaderOpen(!uploaderOpen)
  }
  
  const handleUpload = useCallback((val) => {
    console.log(val)
  }, [])
  
  const initialValues = useMemo(() => {
    return user || {
      name: '',
      email: '',
      avatar: '',
      timezone: '',
      language: '',
      password: '',
      confirm_password: '',
      status: 'active'
    }
  }, [user])
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: (values, helpers) => {
      try {
        // onUpdate(values)
        Object.keys(values).forEach(key => {
          if (values[key] === '' || values[key] === null) {
            delete values[key];
          }
        });
        
        onSubmit(values)
      } catch (err) {
        console.error(err);
        
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  })
  
  return (
    <Stack
      spacing={4}
      {...props}>
      <Card>
        <CardContent>
          
          <Stack spacing={3}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
            >
              <Box
                sx={{
                  borderColor: 'neutral.300',
                  borderRadius: '50%',
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  p: '4px'
                }}
              >
                <Box
                  sx={{
                    borderRadius: '50%',
                    height: '100%',
                    width: '100%',
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      alignItems: 'center',
                      backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                      borderRadius: '50%',
                      color: 'common.white',
                      cursor: 'pointer',
                      display: 'flex',
                      height: '100%',
                      justifyContent: 'center',
                      left: 0,
                      opacity: 0,
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      zIndex: 1,
                      '&:hover': {
                        opacity: 1
                      }
                    }}
                    onClick={handleOpen}
                  >
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <SvgIcon color="inherit">
                        <Camera01Icon/>
                      </SvgIcon>
                      <Typography
                        color="inherit"
                        variant="subtitle2"
                        sx={{fontWeight: 700}}
                      >
                        Select
                      </Typography>
                    </Stack>
                  </Box>
                  <Avatar
                    src={user?.avatar || '/assets/avatars/avatar-anika-visser.png'}
                    sx={{
                      height: 100,
                      width: 100
                    }}
                  >
                    <SvgIcon>
                      <User01Icon/>
                    </SvgIcon>
                  </Avatar>
                </Box>
              </Box>
              <Button
                color="inherit"
                size="small"
                onClick={handleOpen}
              >
                Change
              </Button>
            </Stack>
            <form noValidate>
              <Stack spacing={3}>
                <Input
                  fullWidth
                  label="Full name"
                  name="name"
                  type="text"
                  error={!!(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <Input
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  error={!!(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <Input
                  name="avatar"
                  type="text"
                  value={formik.values.avatar}
                  sx={{display: 'none'}}
                />
                <Input
                  fullWidth
                  label="Timezone"
                  name="timezone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  value={formik.values.timezone || ''}
                >
                  {
                    timezones.map(option => {
                      return (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      )
                    })
                  }
                </Input>
                <Input
                  fullWidth
                  label="Language"
                  name="language"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  value={formik.values.language || ''}
                >
                  {
                    languageOptions.map(option => {
                      return (
                        <MenuItem key={option.value} value={option.value}>
                          <Stack direction={'row'} spacing={2} alignItems={'center'}>
                            <img
                              alt={option.label}
                              src={option.icon}
                            />
                            <Box>
                              {option.label}
                            </Box>
                          </Stack>
                        </MenuItem>
                      )
                    })
                  }
                </Input>
                <Input
                  fullWidth
                  label="Status"
                  name="status"
                  onChange={formik.handleChange}
                  select
                  value={formik.values.status || ''}
                >
                  <MenuItem key={'active'} value={'active'}>
                    Active
                  </MenuItem>
                  <MenuItem key={'blocked'} value={'blocked'}>
                    Blocked
                  </MenuItem>
                </Input>
                <Input
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="New password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPass ? 'text' : 'password'}
                  value={formik.values.password || ''}
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
                  error={!!(formik.touched.password && formik.errors.confirm_password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.confirm_password}
                  label="Confirm password"
                  name="confirm_password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.confirm_password || ''}
                />
                <Stack direction={'row'} justifyContent={'end'}>
                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={formik.handleSubmit}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
      <FileUploader
        onClose={handleClose}
        open={uploaderOpen}
        onUpload={handleUpload}
      />
    </Stack>
  );
};
