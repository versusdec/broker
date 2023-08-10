import {useCallback, useEffect, useMemo, useState} from 'react';
import {v4 as uuid} from 'uuid'
import NextLink from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
  Autocomplete,
  Button,
  Card,
  CardContent, Checkbox,
  Chip, Divider,
  Link,
  MenuItem,
  Stack,
  SvgIcon, Tab, Tabs, TextField,
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
import {Details} from "../../../components/roles/details";

const Page = withRolesAddGuard(() => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState('details');
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
    
    const handleTabsChange = useCallback((event, value) => {
      setCurrentTab(value);
    }, []);
    
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
    
    const handleGrants = useCallback((grant) => {
      const grants = [...role.grants];
      const i = grants.indexOf(grant);
      if (i > -1) {
        grants.splice(i, 1)
      } else {
        grants.push(grant)
      }
      setRole(prev => ({...prev, grants}))
    }, [role])
    
    const formik = useFormik({
      enableReinitialize: true,
      initialValues,
      validationSchema,
      errors: {},
      onSubmit: async (values, helpers) => {
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
            <Stack>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                <Tab
                  label={'Details & Accesses'}
                  value={'details'}
                />
                <Tab
                  label={'Members'}
                  value={'members'}
                />
              </Tabs>
              <Divider/>
            </Stack>
            {currentTab === 'details' && <Details
              formik={formik}
              role={role}
              handleGrants={handleGrants}
            />}
          </Stack>
        </>}
      </>
    );
  }
)

export default Page;

Page.defaultProps =
  {
    title: 'Roles'
  }
