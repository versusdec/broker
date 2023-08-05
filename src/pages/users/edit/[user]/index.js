import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Box,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {useUser} from "../../../../hooks/useUser";
import {root} from "../../../../api/config";
import {api} from "../../../../api";
import {actions} from "../../../../slices/usersSlice";
import {useDispatch} from "../../../../store";
import {withUsersAddGuard} from "../../../../hocs/with-users-add-guard";
import {useGrants} from "../../../../hooks/useGrants";
import {DetailsTab} from "../../../../components/users/details";
import {SecurityTab} from "../../../../components/users/security";
import {ProjectsTab} from "../../../../components/users/projects";
import {useRouter} from "next/dist/client/compat/router";
import {useMe} from "../../../../hooks/useMe";
import NextLink from "next/link";
import {paths} from "../../../../navigation/paths";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import {useFormik} from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {Button} from "../../../../components/button";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";

const tabs = [
  {label: 'Details', value: 'general'},
  {label: 'Security', value: 'security'},
  {label: 'Available Projects', value: 'projects'},
];

const Page = withUsersAddGuard(() => {
  const [currentTab, setCurrentTab] = useState('general');
  const dispatch = useDispatch();
  const router = useRouter();
  const id = +router.query.user;
  const isNew = isNaN(id);
  const {data} = useUser(id);
  const me = useMe();
  const grants = useGrants(me.data?.role_id);
  const editGrant = grants.includes('users.write');
  const isAdmin = me?.data && me.data.role === 'admin';
  const [projectsDialog, setProjectsDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [roles, setRoles] = useState([]);
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState(null);
  const [managers, setManagers] = useState([]);
  const [manager, setManager] = useState(null);
  const [user, setUser] = useState({
    "name": "",
    "email": "",
    "timezone": 180,
    "language": "en",
    "avatar": "",
    "password": "",
    "company": "",
    "status": "active",
    "projects": [],
    "users": [],
  });
  
  useEffect(() => {
    if (data) {
      setUser(data);
    }
    
    return () => {
      dispatch(actions.fillUser(null))
    }
  }, [dispatch, data, id])
  
  const getClients = useCallback(async () => {
    const {result} = await api.users.list({
      role: 'client',
      status: 'active',
      limit: 1000
    })
    if (result) {
      setClients(result.items)
    }
  }, [])
  
  const getManagers = useCallback(async () => {
    const {result} = await api.users.list({
      role: 'manager',
      status: 'active',
      limit: 1000
    })
    
    if (result) {
      setManagers(result.items)
    }
  }, [])
  
  const getProjects = useCallback(async () => {
    const {result} = await api.projects.list({
      status: 'active',
      limit: 1000
    })
    if (result) {
      setProjects(result.items)
    }
  }, [])
  
  const getRoles = useCallback(async () => {
    const {result} = await api.roles.list({
      status: 'active',
      limit: 1000
    })
    if (result && result.items && Array.isArray(result.items)) {
      setRoles(result.items)
    }
  }, [])
  
  useEffect(() => {
    getProjects();
    getRoles();
    getManagers();
  }, [getProjects, getRoles, getManagers])
  
  useEffect(() => {
    if (isAdmin) {
      getClients();
    }
  }, [isAdmin, getClients])
  
  useEffect(() => {
    if (user.client_id && clients?.length) {
      const c = clients.find(i => {
        return i.id === user.client_id
      })
      
      setClient(c)
    } else if (clients?.length)
      setClient(clients[0])
  }, [user, clients])
  
  useEffect(() => {
    if (user.manager_id && managers?.length) {
      const c = managers.find(i => {
        return i.id === user.manager_id
      })
      setManager(c)
    }
  }, [user, managers])
  
  useEffect(() => {
    if (projects.length) {
      let p = [];
      user && user.projects?.length && user.projects.forEach(i => {
        p.push(projects.find(p => p.id === i));
      })
      setSelectedProjects(p)
    }
  }, [user, projects])
  
  const onClientChange = useCallback((client) => {
    setClient(client)
  }, [])
  
  const onRoleChange = useCallback((role) => {
    if (role < 0) {
      delete user.role_id;
      let r;
      switch (role) {
        case -1:
          r = 'admin'
          break;
        case -2:
          r = 'client'
          break;
        case -3:
          r = 'manager'
          break;
        case -4:
          r = 'support'
          break;
        default:
          break;
      }
      setUser(prev => ({...prev, role: r}))
    } else {
      delete user.role;
      setUser(prev => ({...prev, role_id: role}))
    }
  }, [])
  
  const onManagerChange = useCallback((manager) => {
    setManager(manager)
  }, [])
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);
  
  const handleRemoveProject = useCallback((i) => {
    const items = [...user.projects]
    items.splice(i, 1)
    setUser(prev => ({...prev, projects: items}))
  }, [user])
  
  const handleSubmit = useCallback(async (values) => {
    const data = {...values}
    
    data.phone === '' ? delete isNew.phone : data.phone = data.phone.replace(/[^0-9]/g, '');
    
    isAdmin ? data.client_id = client.id : delete data.client_id;
    
    if (isNew) {
      try {
        const {result, error} = await api.users.add(data);
        if (result && !error) {
          router.replace('/users/edit/' + result)
        } else {
          toast.error('Something went wrong')
        }
      } catch (e) {
        toast.error('Something went wrong')
      }
    } else {
      data.id = user.id;
      const res = await api.users.update(data)
      if (!res.error) {
        dispatch(actions.fillUser({...data}))
        toast.success('Changes saved')
      } else {
        toast.error('Something went wrong')
      }
    }
  }, [dispatch, client, isAdmin, isNew, router, user])
  
  const handleAvatarUpload = useCallback(async (files) => {
    setUser(state => ({
      ...state,
      avatar: root + files[0].path
    }))
    if (!isNew) {
      const res = await api.users.update(user)
      if (!res.error) {
        dispatch(actions.fillUser(user))
        toast.success('Changes saved')
      } else {
        toast.error('Something went wrong')
      }
    }
  }, [user, isNew, dispatch]);
  
  const handleAvatarRemove = useCallback(async () => {
    setUser(state => ({
      ...state,
      avatar: ''
    }))
    if (!isNew) {
      const res = await api.users.update(user)
      if (!res.error) {
        dispatch(actions.fillUser(user))
        toast.success('Changes saved')
      } else {
        toast.error('Something went wrong')
      }
    }
  }, [dispatch, isNew, user])
  
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
    password: Yup
      .string()
      .min(8)
      .required('Password is required')
  });
  
  const initialValues = useMemo(() => ({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    timezone: user?.timezone || 0,
    language: user?.language || 'en',
    phone: user?.phone || '',
    company: user?.company || '',
    projects: user?.projects || [],
    password: user?.password || ''
  }), [user]);
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, helpers) => {
      try {
        handleSubmit(values)
      } catch (err) {
        console.error(err);
        
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  })
  
  const validate = useCallback(async () => {
    const errs = await formik.validateForm()
    if (errs.password) setCurrentTab('security')
    if (Object.keys(errs).length && !errs.password) setCurrentTab('general')
    formik.handleSubmit()
  }, [formik])
  
  const accountGeneralSettingsProps = {
    user,
    formik,
    onUpload: handleAvatarUpload,
    onRemove: handleAvatarRemove,
    editGrant,
    isAdmin,
    roles,
    managers,
    manager,
    clients,
    client,
    onManagerChange,
    onClientChange,
    onRoleChange,
    validate
  }
  
  return <>
    <Box>
      <Stack
        spacing={3}
        mb={3}
      >
        <div>
          <Link
            color="text.primary"
            component={NextLink}
            href={paths.users.index}
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
              Users
            </Typography>
          </Link>
        </div>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant="h4">
            {isNew && 'Add user'}
            {!isNew && user.name}
          </Typography>
          {currentTab === 'projects' && !!(isAdmin || editGrant) && <Button
            startIcon={(
              <SvgIcon>
                <PlusIcon/>
              </SvgIcon>
            )}
            variant={'contained'}
            onClick={() => {
              setProjectsDialog(true)
            }}
          >Add to Project</Button>}
        </Stack>
        <div>
          <Tabs
            indicatorColor="primary"
            onChange={handleTabsChange}
            scrollButtons="auto"
            textColor="primary"
            value={currentTab}
            variant="scrollable"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
          <Divider/>
        </div>
      </Stack>
      {currentTab === 'general' && (
        <DetailsTab
          {...accountGeneralSettingsProps}
        />
      )}
      {currentTab === 'security' && (
        <SecurityTab
          user={data}
          formik={formik}
          validate={validate}
          editGrant={editGrant}
          isAdmin={isAdmin}
        />
      )}
      {currentTab === 'projects' && (
        <ProjectsTab
          user={data}
          items={projects}
          selected={selectedProjects}
          formik={formik}
          onChange={(val) => {
            setSelectedProjects(val)
          }}
          dialog={projectsDialog}
          setDialog={(val) => {
            setProjectsDialog(val)
          }}
          removeItem={handleRemoveProject}
          validate={validate}
          handleChange={(items) => {
            const ps = []
            items.forEach(item => {
              ps.push(item.id)
            })
            console.log(ps);
            setUser(prev => ({...prev, projects: ps}))
            setProjectsDialog(false)
          }}
        />
      )}
    
    </Box>
  </>;
});

Page.defaultProps = {
  title: 'Users'
}

export default Page;
