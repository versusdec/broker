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
  Unstable_Grid2 as Grid, Paper, Autocomplete, TextField, List
} from '@mui/material';
import {Input} from "../input";
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


export const DetailsTab = (
  {
    user,
    onUpload,
    onRemove,
    editGrant,
    isAdmin,
    roles,
    client,
    clients,
    onClientChange,
    manager,
    managers,
    onManagerChange,
    formik,
    validate,
    onRoleChange,
    ...props
  }
) => {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [timezones, setTimezones] = useState(null);
  const [role, setRole] = useState(-3);
  const [disabled, setDisabled] = useState(false);
  const isDisabled = !(isAdmin || editGrant);
  
  const handleRoleChange = useCallback((val) => {
    // setRole(val)
    onRoleChange(val)
  }, [])
  
  useEffect(() => {
    if (user.role_id) setRole(user.role_id)
    else {
      switch (user.role) {
        case 'admin':
          setRole(-1)
          break;
        case 'client':
          setRole(-2)
          break;
        case 'manager':
          setRole(-3)
          break;
        case 'support':
          setRole(-4)
          break;
        default:
          break;
      }
    }
  }, [user])
  
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
                    <Stack spacing={3}>
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
                            />
                            <Box mt={2}>
                              <Link href={'#'} fontSize={14} onClick={(e) => {
                                e.preventDefault();
                                console.log('email confirmation')
                              }}>Confirm email address.</Link>
                            </Box>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <Input
                              fullWidth
                              label="Phone number"
                              name="phone"
                              type="tel"
                              error={!!(formik.touched.phone && formik.errors.phone)}
                              helperText={formik.touched.phone && formik.errors.phone}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.phone}
                            />
                            <Box mt={2}>
                              <Link href={'#'} fontSize={14} onClick={(e) => {
                                e.preventDefault();
                                console.log('phone confirmation')
                              }}>Confirm phone number</Link>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                      {!isDisabled && <Stack direction={'row'} justifyContent={'start'}>
                        <Button
                          disabled={disabled}
                          variant={'contained'}
                          onClick={(e) => {
                            setDisabled(true);
                            setTimeout(() => {
                              setDisabled(false)
                            }, 500)
                            validate()
                          }}
                        >
                          Save Changes
                        </Button>
                      </Stack>}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant="h6">
                      Role & Manager
                    </Typography>
                    <Box>
                      <Grid container spacing={2} p={0}>
                        <Grid xs={12} md={6}>
                          <Input
                            fullWidth
                            label="Role"
                            name="role"
                            onChange={(e) => {
                              handleRoleChange(e.target.value)
                            }}
                            select
                            value={role}
                          >
                            {isAdmin &&
                            <MenuItem key={'admin'} value={-1}>
                              <Box sx={{textTransform: 'capitalize'}}>
                                Admin
                              </Box>
                            </MenuItem>}
                            {isAdmin &&
                            <MenuItem key={'client'} value={-2}>
                              <Box sx={{textTransform: 'capitalize'}}>
                                Client
                              </Box>
                            </MenuItem>}
                            <MenuItem key={'manager'} value={-3}>
                              <Box sx={{textTransform: 'capitalize'}}>
                                Manager
                              </Box>
                            </MenuItem>
                            <MenuItem key={'support'} value={-4}>
                              <Box sx={{textTransform: 'capitalize'}}>
                                Support
                              </Box>
                            </MenuItem>
                            {Boolean(roles?.length) && roles.map(item => {
                              return <MenuItem key={item.id} value={item.id}>
                                <Box sx={{textTransform: 'capitalize'}}>
                                  {item.name}
                                </Box>
                              </MenuItem>
                            })}
                          </Input>
                        </Grid>
                        <Grid xs={12} md={6}>
                          <Autocomplete
                            disablePortal
                            options={managers}
                            getOptionLabel={(i) => {
                              if (i === '') return '';
                              else return (i.name ? i.name + ' | ' : '') + i.email
                            }}
                            isOptionEqualToValue={(option, value) => {
                              console.log(value === '')
                              if (value === '') return true;
                              else return option.id === value.id
                            }}
                            onChange={(e, val) => {
                              onManagerChange(val)
                            }}
                            value={manager || ''}
                            renderInput={(params) => <TextField {...params}
                                                                fullWidth
                                                                name="manager_id"
                                                                label="Manager"/>}
                          />
                        </Grid>
                        {isAdmin ? !!clients.length && <Grid xs={12}>
                          <Autocomplete
                            disablePortal
                            disableClearable
                            options={clients}
                            getOptionLabel={(i) => {
                              return (i.name ? i.name + ' | ' : '') + i.email
                            }}
                            onChange={(e, val) => {
                              onClientChange(val)
                            }}
                            value={client || clients[0] || undefined}
                            renderInput={(params) => <TextField {...params}
                                                                fullWidth
                                                                name="client_id"
                                                                label="Client"/>}
                          />
                        </Grid> : ''}
                      </Grid>
                    </Box>
                    {!isDisabled && <Stack direction={'row'} justifyContent={'start'}>
                      <Button
                        disabled={disabled}
                        variant={'contained'}
                        onClick={(e) => {
                          setDisabled(true);
                          setTimeout(() => {
                            setDisabled(false)
                          }, 500)
                          validate()
                        }}
                      >
                        Save Changes
                      </Button>
                    </Stack>}
                  </Stack>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant="h6">
                      Location
                    </Typography>
                    <Box>
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
                    </Box>
                    {!isDisabled && <Stack direction={'row'} justifyContent={'start'}>
                      <Button
                        disabled={disabled}
                        variant={'contained'}
                        onClick={(e) => {
                          setDisabled(true);
                          setTimeout(() => {
                            setDisabled(false)
                          }, 500)
                          validate()
                        }}
                      >
                        Save Changes
                      </Button>
                    </Stack>}
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
                        <Box display={'flex'} p={4} justifyContent={'center'} alignItems={'center'} sx={{aspectRatio: '1/1'}}>
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
                      
                      {!isDisabled && <Stack direction={{xs: 'column', sm: 'row', md: 'column', lg: 'column', xl: 'row'}} spacing={1}>
                        <Button
                          onClick={handleOpen}
                          variant={'contained'}
                          startIcon={(<SvgIcon>
                            <EditOutlined/>
                          </SvgIcon>)}
                        >
                          Upload New Picture
                        </Button>
                        {Boolean(user.avatar.length) && <Button
                          variant={'outlined'}
                          startIcon={(<SvgIcon>
                            <DeleteOutlined/>
                          </SvgIcon>)}
                          onClick={() => {
                            onRemove()
                          }}
                        >
                          Remove Picture
                        </Button>}
                      
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

DetailsTab.propTypes = {
  user: PropTypes.object,
  onSubmit: PropTypes.func,
  updateAvatar: PropTypes.func
  
}