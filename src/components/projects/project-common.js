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

export const CommonTab = ({onSubmit, isNew, userRole, project, clients, ...props}) => {
  const [client, setClient] = useState(clients[0])
  
  useEffect(() => {
    if (project.client_id && clients) {
      const c = clients.find(i => {
        return i.id === project.client_id
      })
      setClient(c)
    }
  }, [project, clients])
  
  const onClientChange = (client) => {
    setClient(client)
  }
  
  const initialValues = useMemo(() => project, [project]);
  const validationSchema = Yup.object({
    name: Yup
      .string()
      .max(255)
      .required('Name is required'),
    description: Yup
      .string()
      .max(255),
    status: Yup
      .string()
      .oneOf(['active', 'archived']),
  });
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: (values, helpers) => {
      try {
        const newValues = {
          ...values
        }
        switch (userRole) {
          case 'admin':
            newValues.client_id = client.id;
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
  
  
  return (
    <Stack
      spacing={4}
      {...props}>
      <Card>
        <CardContent>
          
          <Stack spacing={3}>
            <form noValidate>
              <Stack spacing={3}>
                <Input
                  fullWidth
                  label="Name"
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
                  label="Description"
                  name="description"
                  type="text"
                  error={!!(formik.touched.description && formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
                <Input
                  fullWidth
                  label="Status"
                  name="status"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  value={formik.values.status}
                >
                  <MenuItem key={'active'} value={'active'}>
                    Active
                  </MenuItem>
                  <MenuItem key={'archived'} value={'archived'}>
                    Archived
                  </MenuItem>
                </Input>
                {userRole === 'admin' && clients && <Autocomplete
                  disablePortal
                  disableClearable
                  options={clients}
                  getOptionLabel={(i) => {
                    return (i.name ? i.name + ' | ' : '') + i.email
                  }}
                  onChange={(e, val) => {
                    onClientChange(val)
                  }}
                  value={client || clients[0]}
                  renderInput={(params) => <TextField {...params}
                                                      fullWidth
                                                      name="client_id"
                                                      label="Client"/>}
                />}
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
    </Stack>
  );
};
