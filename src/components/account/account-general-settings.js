import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  SvgIcon,
  Typography,
  Link,
  Alert,
  Unstable_Grid2 as Grid, Paper
} from '@mui/material';
import {Input} from "../input";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useCallback, useEffect, useState} from "react";
import {FileUploader} from "../file-uploader";
import {DeleteOutlined, EditOutlined} from "@mui/icons-material";

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

export const AccountGeneralSettings = ({user, onSubmit, onUpload, onRemove, editGrant, isAdmin, ...props}) => {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [timezones, setTimezones] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const isDisabled = !(isAdmin || editGrant);
  
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
    avatar: user?.avatar || '',
    timezone: user?.timezone || 0,
    language: user?.language || 'en',
    phone: user?.phone || '',
    company: user?.company || '',
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
      {...props}>
      <Stack spacing={4}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            md={8}
          >
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant="h6">
                      Basic details
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Grid container spacing={2} p={0}>
                          <Grid xs={12} md={6}>
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
                              disabled={isDisabled}
                            />
                          </Grid>
                          <Grid xs={12} md={6}>
                            <Input
                              fullWidth
                              label="Company name"
                              name="company"
                              type="text"
                              error={!!(formik.touched.company && formik.errors.company)}
                              helperText={formik.touched.company && formik.errors.company}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.company}
                              disabled={isDisabled}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      <Box>
                        <Grid container spacing={2} p={0}>
                          <Grid xs={12} md={6}>
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
                              disabled={isDisabled}
                            />
                          </Grid>
                          <Grid xs={12} md={6}>
                            <Input
                              fullWidth
                              label="Phone number"
                              name="phone"
                              type="text"
                              error={!!(formik.touched.phone && formik.errors.phone)}
                              helperText={formik.touched.phone && formik.errors.phone}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.phone}
                              disabled={isDisabled}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      <Box>
                        <Grid container spacing={2} p={0}>
                          <Grid xs={12} md={6}>
                            <Alert severity="info">
                              To get access to all platform features you need to <Link href={'#'} onClick={(e) => {
                              e.preventDefault();
                              console.log('email confirmation')
                            }}>confirm email address</Link>.
                            </Alert>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <Alert severity="info">
                              To get access to all platform features you need to <Link href={'#'} onClick={(e) => {
                              e.preventDefault();
                              console.log('phone confirmation')
                            }}>confirm phone number</Link>.
                            </Alert>
                          </Grid>
                        
                        </Grid>
                      </Box>
                      <Stack direction={'row'} justifyContent={'start'}>
                        <Button
                          disabled={disabled}
                          variant={'contained'}
                          onClick={(e) => {
                            setDisabled(true);
                            setTimeout(() => {
                              setDisabled(false)
                            }, 500)
                            formik.handleSubmit(e)
                          }}
                        >
                          Save Changes
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant="h6">
                      Location
                    </Typography>
                    <Grid container p={0} spacing={2}>
                      <Grid xs={12} md={6}>
                        <Input
                          fullWidth
                          label="Timezone"
                          name="timezone"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          select
                          value={timezones ? formik.values.timezone : ''}
                          disabled={isDisabled}
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
                      </Grid>
                      <Grid xs={12} md={6}>
                        <Input
                          fullWidth
                          label="Language"
                          name="language"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          select
                          value={formik.values.language}
                          disabled={isDisabled}
                          size={'small'}
                          sx={{height: 55}}
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
                      </Grid>
                    </Grid>
                    <Stack direction={'row'} justifyContent={'start'}>
                      <Button
                        disabled={disabled}
                        variant={'contained'}
                        onClick={(e) => {
                          setDisabled(true);
                          setTimeout(() => {
                            setDisabled(false)
                          }, 500)
                          formik.handleSubmit(e)
                        }}
                      >
                        Save Changes
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid xs={12} md={4}>
            <Stack>
              <Card>
                <CardContent>
                  
                  <Stack spacing={3}>
                    <Typography variant={'h6'}>
                      Profile Picture
                    </Typography>
                    <Typography variant={'body2'} sx={{color: 'neutral.500'}}>
                      A profile picture helps people recognize you and personalize your account
                    </Typography>
                    <Stack
                      spacing={2}
                    >
                      <Paper>
                        <Box display={'flex'} p={4} justifyContent={'center'} alignItems={'center'} sx={{aspectRatio: '1/1'}} >
                          <Avatar
                            src={user?.avatar}
                            sx={{
                              height: '100%',
                              width: '100%',
                              maxWidth: 272,
                              maxHeight: 272
                            }}
                          >
                            <SvgIcon>
                              <User01Icon/>
                            </SvgIcon>
                          </Avatar>
                          <Input
                            name="avatar"
                            type="text"
                            value={formik.values.avatar}
                            sx={{display: 'none'}}
                          />
                        </Box>
                      </Paper>
                      
                      {(isAdmin || editGrant) && <Stack direction={{xs: 'column', sm: 'row', md: 'column', lg: 'column', xl: 'row'}} spacing={1}>
                        <Button
                          onClick={handleOpen}
                          variant={'contained'}
                          startIcon={(<SvgIcon>
                            <EditOutlined/>
                          </SvgIcon>)}
                        >
                          Upload New Picture
                        </Button>
                        <Button
                          variant={'outlined'}
                          startIcon={(<SvgIcon>
                            <DeleteOutlined/>
                          </SvgIcon>)}
                          onClick={() => {
                            onRemove()
                          }}
                        >
                          Remove Picture
                        </Button>
                      
                      </Stack>}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <FileUploader
        onClose={handleClose}
        open={uploaderOpen}
        onUpload={(files) => {
          onUpload(files)
          handleClose()
        }}
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