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
  Autocomplete
} from '@mui/material';
import {alpha} from '@mui/material/styles';
import {Input} from "../input";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useCallback, useEffect, useMemo, useState} from "react";
import {FileUploader} from "../file-uploader";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useMe} from "../../hooks/useMe";
import {api} from "../../api";

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

export const CommonTab = ({onUpload, onSubmit, isNew, userRole, timezones, user, clients, projects, ...props}) => {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [client, setClient] = useState(null);
  const [project, setProject] = useState([]);

  const initialValues = useMemo(() => user, [user]);
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
      .oneOf(['en', 'de', 'es']),
    password: Yup
      .string()
      .min(8)
      .max(255)
      .when("$other", {
        is: () => isNew,
        then: Yup.string().required('Password is required')
      }),
    password_confirm: Yup
      .string()
      .max(255)
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .when("password", {
        is: (password) => (password && password.length && isNew),
        then: Yup.string().required("Confirm your new password").max(255)
      }),
    status: Yup
      .string()
      .oneOf(['active', 'blocked']),
    role: Yup
      .string()
      .oneOf(['client', 'supervisor', 'operator', 'admin']),
  });
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: (values, helpers) => {
      const newValues = {
        ...values, projects: []
      }
      
      project.forEach((item) => {
        newValues.projects.push(item.id)
      })
      
      try {
        switch (values.role) {
          case 'supervisor':
          case 'operator':
            user.role === 'admin' ? newValues.client_id = client.id : void 0;
            break;
          default:
            delete newValues.client_id;
            break;
        }
        onSubmit(newValues)
        // console.log(values)
      } catch (err) {
        console.error(err);
        
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  })

  useEffect(() => {
    if (user.client_id && clients?.length) {
      const c = clients.find(i => {
        return i.id === user.client_id
      })
      setClient(c)
    }
  }, [user, clients])
  
  useEffect(() => {
    if (projects.length) {
      let p = [];
      if (user.role === 'operator') {
        p.push(projects.find(i => {
          return i.id === user.projects[0]
        }));
      } else if (user.role === 'supervisor') {
        user.projects?.forEach(i => {
          p.push(projects.find(p => p.id === i));
        })
      } else {
        p = [projects[0]]
      }
      setProject(p)
      // formik.setFieldValue('projects', project)
    }
  }, [user, projects])
  
  const onClientChange = (client) => {
    setClient(client)
  }
  
  const onProjectChange = (item) => {
    setProject([item])
  }
  
  const handleOpen = useCallback(() => {
    setUploaderOpen(true)
  }, [])
  
  const handleClose = useCallback(() => {
    setUploaderOpen(false)
  }, [])
  
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
                    src={user?.avatar}
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
                  fullWidth
                  label="Role"
                  name="role"
                  onChange={(e) => {
                    formik.handleChange(e)
                    // handleRoleChange(e.target.value)
                  }}
                  select
                  value={formik.values.role || ''}
                >
                  {['operator', 'supervisor', 'client', 'admin'].map(item=>{
                    switch (item) {
                      case 'client':
                      case 'admin':
                        return userRole === 'admin' && <MenuItem key={item} value={item}>
                          <Box sx={{textTransform: 'capitalize'}}>
                            {item}
                          </Box>
                        </MenuItem>
                      default:
                        return <MenuItem key={item} value={item} >
                          <Box sx={{textTransform: 'capitalize'}}>
                            {item}
                          </Box>
                        </MenuItem>
                    }
                  })}
                </Input>
                {userRole === 'admin' && (formik.values.role === 'supervisor' || formik.values.role === 'operator') && clients.length && <Autocomplete
                  disablePortal
                  disableClearable
                  options={clients}
                  getOptionLabel={(i) => {
                    return (i.name ? i.name + ' | ' : '') + i.email
                  }}
                  onChange={(e, val) => {
                    onClientChange(val)
                  }}
                  value={client || clients[0] || null}
                  renderInput={(params) => <TextField {...params}
                                                      fullWidth
                                                      name="client_id"
                                                      label="Client"/>}
                />}
                {(formik.values.role === 'operator') && projects.length && <Autocomplete
                  disablePortal
                  disableClearable
                  options={projects}
                  getOptionLabel={(i) => {
                    return i.name
                  }}
                  onChange={(e, val) => {
                    onProjectChange(val)
                  }}
                  value={project.length ? project[0] : projects[0]}
                  renderInput={(params) => <TextField {...params}
                                                      fullWidth
                                                      name="projects"
                                                      label="Project"/>}
                />}
                {((formik.values.role === 'supervisor')) && <Autocomplete
                  multiple
                  filterSelectedOptions
                  disableClearable
                  disablePortal
                  options={projects}
                  getOptionLabel={(i) => {
                    return i.name
                  }}
                  onChange={(e, val) => {
                    setProject(val)
                    // formik.setFieldValue("projects", val)
                  }}
                  defaultValue={[]}
                  value={project}
                  // name="projects"
                  renderInput={(params) => <TextField {...params}
                                                      fullWidth
                                                      // error={!!(formik.touched.projects && formik.errors.projects[0])}
                                                      // helperText={formik.touched.projects && formik.errors.projects[0]}
                                                      // name="projects"
                                                      label="Project"/>}
                />}
                <Input
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
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
                  error={!!(formik.touched.password && formik.errors.password_confirm)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password_confirm}
                  label="Confirm password"
                  name="password_confirm"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password_confirm || ''}
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
        onUpload={(files) => {
          onUpload(files)
          handleClose()
        }}
      />
    </Stack>
  );
};
