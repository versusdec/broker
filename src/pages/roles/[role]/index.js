import {useEffect, useMemo, useState} from 'react';
import {v4 as uuid} from 'uuid'
import NextLink from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
  Autocomplete,
  Button,
  Card,
  CardContent, Checkbox,
  Chip,
  Link,
  MenuItem,
  Stack,
  SvgIcon, TextField,
  Typography,
} from '@mui/material';
import {paths} from '../../../navigation/paths';
import {useRouter} from 'next/router'
import {useRole} from "../../../hooks/useRole";
import {actions} from "../../../slices/rolesSlice";
import {useDispatch} from "../../../store";
import {withRolesAddGuard} from "../../../hocs/with-roles-add-guard";
import * as Yup from "yup";
import {useFormik} from "formik";
import {Input} from "../../../components/input";
import {CheckBox, CheckBoxOutlineBlank} from "@mui/icons-material";
import {api} from "../../../api";
import toast from "react-hot-toast";

const Page = withRolesAddGuard(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [grants, setGrants] = useState([]);
  const [role, setRole] = useState({
    "name": "",
    "description": "",
    "status": "active",
    "grants": [],
  });
  
  const id = +router.query.role;
  const isNew = isNaN(id);
  const {data, loading, error} = useRole(id);
  
  useEffect(() => {
    const getGrants = async () => {
      const res = await fetch('/grants.json').then(res => res.json())
      setGrants(res)
    }
    getGrants()
  }, [])
  
  
  useEffect(() => {
    if (data) {
      setRole(data);
    }
    
    return () => {
      dispatch(actions.fillRole(null))
    }
  }, [dispatch, data, id])
  
  const initialValues = useMemo(() => role, [role]);
  const validationSchema = Yup.object({
    name: Yup
      .string()
      .max(255)
      .required('Name is required'),
    description: Yup
      .string(),
    status: Yup
      .string()
      .oneOf(['active', 'archived']),
    grants: Yup
      .array().min(1, 'Select grants')
  });
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: async (values, helpers) => {
      console.log(values)
      const data = {...role, ...values}
      const {result, error} = await api.roles[isNew ? 'add' : 'update'](data)
      if (result && isNew)
        router.replace('/roles/' + result);
      else if (result && !isNew) {
        dispatch(actions.fillRole(data))
        toast.success('Changes saved')
      } else if (error) {
        console.log(error)
        toast.error('Something went wrong')
      }
    }
  })
  
  return (
    <>
      {<>
        <Stack spacing={4} mb={3}>
          <div>
            <Link
              color="text.primary"
              component={NextLink}
              href={paths.roles.index}
              sx={{
                alignItems: 'center',
                display: 'inline-flex'
              }}
              underline="hover"
            >
              <SvgIcon sx={{mr: 1}}>
                <ArrowLeftIcon/>
              </SvgIcon>
              <Typography variant="subtitle2">
                Roles
              </Typography>
            </Link>
          </div>
          <Stack
            alignItems="flex-start"
            direction={{
              xs: 'column',
              md: 'row'
            }}
            justifyContent="space-between"
            spacing={4}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
            >
              <Stack>
                <Typography variant="h4">
                  {isNew && 'Add role'}
                  {!isNew && role.name}
                </Typography>
                {!isNew && <>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
                    <Typography variant="subtitle2">
                      ID:
                    </Typography>
                    <Chip
                      label={role.id}
                      size="small"
                    />
                  </Stack>
                </>}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          spacing={4}>
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
                      onChange={formik.handleChange}
                      select
                      value={formik.values.status || ''}
                    >
                      <MenuItem key={'active'} value={'active'}>
                        Active
                      </MenuItem>
                      <MenuItem key={'archived'} value={'archived'}>
                        Blocked
                      </MenuItem>
                    </Input>
                    <Autocomplete
                      multiple
                      options={grants}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option}
                      isOptionEqualToValue={(option, value) => option === value}
                      value={formik.values.grants || []}
                      renderOption={(props, option, {selected}) => (
                        <li {...props}>
                          <Checkbox
                            icon={<CheckBoxOutlineBlank fontSize={'small'}/>}
                            checkedIcon={<CheckBox fontSize={'small'}/>}
                            style={{marginRight: 8}}
                            checked={selected}
                          />
                          {option}
                        </li>
                      )}
                      onChange={(e, val) => {
                        formik.setFieldValue('grants', val)
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth
                                   error={!!(formik.errors.grants)}
                                   helperText={formik.errors.grants}
                                   label="Grants" placeholder="Select grants"/>
                      )}
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
        </Stack>
      </>}
    </>
  );
})

export default Page;

Page.defaultProps = {
  title: 'Roles'
}
