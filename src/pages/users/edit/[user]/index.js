import {useCallback, useEffect, useMemo, useState} from 'react';
import NextLink from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
  Avatar,
  Chip,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {paths} from '../../../../navigation/paths';
import {CommonTab} from '../../../../components/users/user-common';
import {useUser} from "../../../../hooks/useUser";
import {useRouter} from 'next/router'
import {useMe} from "../../../../hooks/useMe";
import {root} from "../../../../api/config";
import {api} from "../../../../api";
import {actions} from "../../../../slices/usersSlice";
import toast from "react-hot-toast";
import {useDispatch} from "../../../../store";
import {withUsersAddGuard} from "../../../../hocs/with-users-add-guard";
import * as Yup from "yup";
import {useFormik} from "formik";
import {QueuesTab} from "../../../../components/users/user-queues";
import {OperatorsTab} from "../../../../components/users/user-operators";
import {usePagination} from "../../../../hooks/usePagination";
import {useGrants} from "../../../../hooks/useGrants";

const Page = withUsersAddGuard(() => {
    const dispatch = useDispatch();
    const router = useRouter();
    const me = useMe();
    const userRole = me.data?.role;
    
    const [currentTab, setCurrentTab] = useState('common');
    const [timezones, setTimezones] = useState(null);
    const [user, setUser] = useState({
      "name": "",
      "email": "",
      "timezone": 180,
      "language": "en",
      "avatar": "",
      "password": "",
      "company": "",
      "status": "active",
      "queues": [],
      "projects": [],
      "users": [],
      "role_id": 1
    });
    const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
    const [queues, setQueues] = useState([]);
    const [clients, setClients] = useState([]);
    const [client, setClient] = useState(null);
    const [project, setProject] = useState([]);
    const [projects, setProjects] = useState([]);
    const [roles, setRoles] = useState([]);
    const [operators, setOperators] = useState({limit: 10, total: 0, items: []});
    const id = +router.query.user;
    const newUser = isNaN(id);
    const {data} = useUser(id);
    const grants = useGrants(me.data?.role_id);
    const isAdmin = me.data && me.data.role_id === 0;
    const editUsersGrant = isAdmin || grants.includes('users.write');
    const [queuesLoading, setQueuesLoading] = useState(false);
    
    useEffect(() => {
      if (data) {
        const u = {...data};
        u.password_confirm = data.password;
        setUser(u);
      }
      
      return () => {
        dispatch(actions.fillUser(null))
      }
    }, [dispatch, data, id])
    
    const getQueues = useCallback(async () => {
      const {result} = await api.queues.list({
        status: 'active',
        limit: 1000
      })
      if (result) {
        setQueues(result.items)
      }
    }, [])
    
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
      if (result) {
        setRoles(result.items)
      }
    }, [])
    
    const getOperators = useCallback(async () => {
      const {result} = await api.users.list({
        status: 'active',
        role: 'manager',
        limit: 10
      })
      if (result) {
        setOperators(result)
      }
    }, [])
    
    useEffect(() => {
      getProjects();
      getRoles();
    }, [getProjects, getRoles])
    
    useEffect(() => {
      if (isAdmin) {
        getClients();
      }
    }, [isAdmin, getClients])
    
    useEffect(() => {
      if (!newUser && (grants.includes('projects.queues.read') || isAdmin)) {
        getQueues();
      }
      if (!newUser && (grants.includes('users.read') || isAdmin)) {
        getOperators();
      }
    }, [newUser, grants, getQueues, getOperators, isAdmin])
    
    useEffect(() => {
      if (user.client_id && clients?.length) {
        const c = clients.find(i => {
          return i.id === user.client_id
        })
        setClient(c)
      }
    }, [user, clients])
    
    useEffect(() => {
      if (projects.length && !newUser) {
        let p = [];
        user && user.projects?.length && user.projects.forEach(i => {
          p.push(projects.find(p => p.id === i));
        })
        setProject(p)
      }
    }, [user, projects, newUser])
    
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
    
    const onClientChange = useCallback((client) => {
      setClient(client)
      // onChange({client_id: client.id})
    }, [])
    
    const onProjectChange = useCallback((item) => {
      setProject([item])
    }, [])
    
    const onProjectsChange = useCallback((items) => {
      setProject(items)
    }, [])
    
    const handleTabsChange = useCallback((event, value) => {
      setCurrentTab(value);
    }, []);
    
    const handleAvatarUpload = useCallback(async (files) => {
      setUser(state => ({
        ...state,
        avatar: root + files[0].path
      }))
      if (!newUser) {
        const res = await api.users.update(user)
        if (!res.error) {
          dispatch(actions.fillUser(user))
          toast.success('Changes saved')
        } else {
          toast.error('Something went wrong')
        }
      }
    }, [user, newUser, dispatch]);
    
    const handleQueuesChange = useCallback(async () => {
      setQueuesLoading(true)
      const data = {id: user.id, queues: []}
      user.queues.map(i => {
        data.queues.push(i.id)
      });
      const {error} = await api.users.update(data);
      setQueuesLoading(false)
      if (error) toast.error(error.message)
    }, [user]);
    
    const handleQueuesSetup = useCallback(async () => {
      const {result, error} = await api.queues.setup({});
      result ? toast.success('Changes saved') : toast.error('Something went wrong')
    }, [])
    
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
          is: () => newUser,
          then: Yup.string().required('Password is required')
        }),
      password_confirm: Yup
        .string()
        .max(255)
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .when("password", {
          is: (password) => (password && password.length && newUser),
          then: Yup.string().required("Confirm your new password").max(255)
        }),
      status: Yup
        .string()
        .oneOf(['active', 'blocked']),
      role_id: Yup
        .number()
    });

    const formik = useFormik({
      enableReinitialize: true,
      initialValues,
      validationSchema,
      errors: {},
      onSubmit: async (values, helpers) => {
        const data = {...values}
        
        if (data.phone === '') delete data.phone;
        
        isAdmin ? data.client_id = client.id : delete data.client_id;
        
        if (newUser) {
          try {
            const {result, error} = await api.users.add(data);
            if (result && !error) {
              router.replace('/users' + result)
            } else {
              toast.error('Something went wrong')
            }
          } catch (e) {
            toast.error('Something went wrong')
          }
        } else {
          const res = await api.users.update(data)
          if (!res.error) {
            dispatch(actions.fillUser({...data, queues: user.queues}))
            toast.success('Changes saved')
          } else {
            toast.error('Something went wrong')
          }
        }
      }
    })
    
    return (
      <>
        {user && <>
          <Stack spacing={4} mb={3}>
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
                {!newUser && <Avatar
                  src={user.avatar}
                  sx={{
                    height: 64,
                    width: 64
                  }}
                />}
                <Stack>
                  <Typography variant="h4">
                    {newUser && 'Add user'}
                    {!newUser && user.name}
                  </Typography>
                  {!newUser && <>
                    <Typography variant="body2" color={'text.secondary'}>
                      {user.email}
                    </Typography>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <Typography variant="subtitle2">
                        ID:
                      </Typography>
                      <Chip
                        label={user.id}
                        size="small"
                      />
                    </Stack>
                  </>}
                </Stack>
              </Stack>
            </Stack>
            <div>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                sx={{mt: 3}}
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                <Tab
                  key={'common'}
                  label={'Common'}
                  value={'common'}
                />
                {!newUser && grants.includes('users.read') && <Tab
                  key={'operators'}
                  label={'Operators'}
                  value={'operators'}
                />}
                {!newUser && grants.includes('projects.queues.read') && <Tab
                  key={'queues'}
                  label={'Queues'}
                  value={'queues'}
                />}
              </Tabs>
              <Divider/>
            </div>
          </Stack>
          {currentTab === 'common' && (
            <div>
              {((!newUser && user.id) || newUser) && me.data && <CommonTab
                user={user}
                isAdmin={isAdmin}
                onUpload={handleAvatarUpload}
                timezones={timezones}
                clients={clients}
                projects={projects}
                roles={roles}
                formik={formik}
                client={client}
                onClientChange={onClientChange}
                project={project}
                onProjectChange={onProjectChange}
                onProjectsChange={onProjectsChange}
              />}
            </div>
          )}
          {currentTab === 'operators' && <OperatorsTab
            users={operators.items}
            page={page}
            limit={limit}
            offset={offset}
            onPageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            total={operators.total}
            editGrant={editUsersGrant}
          />}
        </>}
        {currentTab === 'queues' && <QueuesTab
          items={queues}
          selected={user.queues}
          onChange={(val) => {
            setUser(prev => ({...prev, queues: val}))
          }}
          loading={queuesLoading}
          handleChange={handleQueuesChange}
          handleSetup={handleQueuesSetup}
          role={userRole}
        />}
      </>
    );
  }
)

export default Page;

Page.defaultProps =
  {
    title: 'Users'
  }
