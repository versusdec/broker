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
import {paths} from '../../../navigation/paths';
import {CommonTab} from '../../../components/users/user-common';
import {useUser} from "../../../hooks/useUser";
import {useRouter} from 'next/router'
import {useMe} from "../../../hooks/useMe";
import {root} from "../../../api/config";
import {api} from "../../../api";
import {actions} from "../../../slices/usersSlice";
import toast from "react-hot-toast";
import {useDispatch} from "../../../store";
import {withUsersAddGuard} from "../../../hocs/with-users-add-guard";
import * as Yup from "yup";
import {useFormik} from "formik";
import {QueuesTab} from "../../../components/users/user-queues";
import {OperatorsTab} from "../../../components/users/user-operators";

const tabs = [
  {label: 'Common', value: 'common'},
  {label: 'Queues', value: 'queues'},
  {label: 'Operators', value: 'operators'}
];

const Page = withUsersAddGuard(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const me = useMe();
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
  const [clients, setClients] = useState([]);
  const [queues, setQueues] = useState([]);
  const [client, setClient] = useState(null);
  const [project, setProject] = useState([]);
  const [projects, setProjects] = useState([]);
  const id = +router.query.user;
  const newUser = isNaN(id);
  const {data} = useUser(id);
  
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
  
  useEffect(() => {
    getProjects();
    
    if (me.user?.role === 'admin') {
      getClients();
    }
    if (!newUser) {
      getQueues();
    }
  }, []);
  
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
    }
  }, [user, projects])
  
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
  
  
  const onClientChange = (client) => {
    setClient(client)
    onChange({client_id: client.id})
  }
  
  const onProjectChange = (item) => {
    setProject([item])
  }
  
  const onProjectsChange = (items) => {
    setProject(items)
  }
  
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
  }, [user, newUser]);
  
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
    role: Yup
      .string()
      .oneOf(['client', 'supervisor', 'operator', 'admin']),
  });
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: async (values, helpers) => {
      const data = {...values, queues: []}
      values.queues.forEach(q => {
        data.queues.push(q.id)
      })
      switch (user.role) {
        case 'supervisor':
        case 'operator':
          me.user.role === 'admin' ? data.client_id = client.id : void 0;
          break;
        default:
          delete data.client_id;
          break;
      }
      
      if (newUser) {
        try {
          const {result, error} = await api.users.add(data);
          if (result && !error) {
            router.replace('/users/' + result)
          } else {
            toast.error('Something went wrong')
          }
        } catch (e) {
          toast.error('Something went wrong')
        }
      } else {
        const res = await api.users.update(data)
        if (!res.error) {
          dispatch(actions.fillUser(data))
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
              {tabs.map((tab) => {
                
                if (formik.values.role === "operator" && tab.value === "operators")
                  return false;
                
                return <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              })}
            </Tabs>
            <Divider/>
          </div>
        </Stack>
        {currentTab === 'common' && (
          <div>
            {((!newUser && user.id) || newUser) && me.user && <CommonTab
              user={user}
              userRole={me.user.role}
              onUpload={handleAvatarUpload}
              timezones={timezones}
              clients={clients}
              projects={projects}
              formik={formik}
              client={client}
              onClientChange={onClientChange}
              project={project}
              onProjectChange={onProjectChange}
              onProjectsChange={onProjectsChange}
            />}
          </div>
        )}
        {currentTab === 'queues' && <QueuesTab
          items={queues}
          selected={user.queues}
          onChange={(data) => {
            setUser(user => {
              return {
                ...user,
                queues: data
              }
            })
          }}
          formik={formik}
          tabChange={handleTabsChange}
        />}
        {currentTab === 'operators' && <OperatorsTab
          items={[]}
          selected={user.queues}
          onChange={(data) => {
            setUser(user => {
              return {
                ...user,
                queues: data
              }
            })
          }}
          formik={formik}
          tabChange={handleTabsChange}
        />}
      </>}
    </>
  );
})

export default Page;

Page.defaultProps = {
  title: 'Users'
}
