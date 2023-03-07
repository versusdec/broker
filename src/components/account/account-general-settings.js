import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider, MenuItem,
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
import {useCallback, useEffect, useState} from "react";
import {FileUploader} from "../file-uploader";

const languageOptions = [
  {
    icon: '/assets/flags/flag-uk.svg',
    label: 'English',
    value: 'en'
  },
  {
    icon: '/assets/flags/flag-ru.svg',
    label: 'Russian',
    value: 'ru'
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
    .number(),
  language: Yup
    .string()
    .oneOf(['en', 'ru'])
});

export const AccountGeneralSettings = (props) => {
  const {user, onSubmit, updateAvatar} = props;
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [timezones, setTimezones] = useState(null);
  
  useEffect(() => {
    const getTimezones = async () => {
      const res = await fetch('/timezones.json').then(res => res.json())
      const t = [];
      for (const i in res) {
        t.push({
          value: +i,
          label: res[i]
        })
      }
      setTimezones(t)
    }
    getTimezones()
  }, [])
  
  const handleOpen = useCallback(() => {
    setUploaderOpen(true)
  }, [])
  
  const handleClose = useCallback(() => {
    setUploaderOpen(false)
  }, [])
  
  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '/assets/avatars/avatar-anika-visser.png',
    timezone: user?.timezone || 0,
    language: user?.language || 'en'
  };
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, helpers) => {
      try {
        // onUpdate(values)
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
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">
                Basic details
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
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
                      value={timezones ? formik.values.timezone : ''}
                    >
                      {
                        !timezones && <MenuItem value=""></MenuItem>
                      }
                      {
                        timezones && timezones.map(option => {
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
                      value={formik.values.language}
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
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <FileUploader
        onClose={handleClose}
        open={uploaderOpen}
        onUpload={(files) => {
          updateAvatar(files)
          handleClose()
        }
        }
        multiple={false}
      />
    </Stack>
  );
};


AccountGeneralSettings.propTypes = {
  user: PropTypes.object,
  onSubmit: PropTypes.func,
  updateAvatar: PropTypes.func
  
}