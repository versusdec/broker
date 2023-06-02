import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Autocomplete, Checkbox
} from '@mui/material';
import {alpha} from '@mui/material/styles';
import {Input} from "../input";
import {useCallback, useState} from "react";
import {FileUploader} from "../file-uploader";
import {CheckBox, CheckBoxOutlineBlank, Visibility, VisibilityOff} from "@mui/icons-material";

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

export const CommonTab = ({
                            onUpload, isAdmin, timezones, user, client, clients, project, projects, roles, formik, onChange,
                            onClientChange, onProjectChange, onProjectsChange, ...props
                          }) => {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [disabled, setDisabled] = useState(false);
  
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
                    !timezones && <MenuItem value=""/>
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
                {roles.length && <Input
                  fullWidth
                  label="Role"
                  name="role_id"
                  onChange={formik.handleChange}
                  select
                  value={formik.values.role_id || ''}
                >
                  {roles.map(item => {
                    return <MenuItem key={item.id} value={item.id}>
                      <Box sx={{textTransform: 'capitalize'}}>
                        {item.name}
                      </Box>
                    </MenuItem>
                  })}
                </Input>}
                {isAdmin ? !!clients.length && <Autocomplete
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
                /> : ''}
                {projects.length && <Autocomplete
                  multiple
                  options={projects}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={project.length ? project : [projects[0]]}
                  renderOption={(props, option, {selected}) => (
                    <li {...props}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlank fontSize={'small'}/>}
                        checkedIcon={<CheckBox fontSize={'small'}/>}
                        style={{marginRight: 8}}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  )}
                  onChange={(e, val) => {
                    onProjectsChange(val)
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth
                               label="Projects" placeholder="Select projects"/>
                  )}
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
                    disabled={disabled}
                    onClick={(e) => {
                      setDisabled(true)
                      setTimeout(() => {
                        setDisabled(false)
                      }, 500)
                      formik.handleSubmit(e)
                    }}
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
