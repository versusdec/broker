import {useCallback, useEffect, useMemo, useState} from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  Menu,
  Unstable_Grid2 as Grid
} from '@mui/material';
import {customersApi} from '../../../api/customers';
import {paths} from '../../../navigation/paths';
import {CommonTab} from '../../../components/users/user-common';
import {MenuItem} from "@mui/material";
import {useUser} from "../../../hooks/useUser";
import {useRouter} from 'next/router'
import {useMe} from "../../../hooks/useMe";
import {root} from "../../../api/config";
import {api} from "../../../api";
import {actions} from "../../../slices/usersSlice";
import toast from "react-hot-toast";
import {useDispatch} from "../../../store";
import {withUsersAddGuard} from "../../../hocs/with-users-add-guard";
import {QueuesListTable} from "../../../components/users/user-queues-table";
import {useProjects} from "../../../hooks/useProjects";

const tabs = [
  {label: 'Common', value: 'common'},
  {label: 'Queues', value: 'queues'},
  {label: 'Operators', value: 'operators'}
];

const setUserUpdate = (user, newValues) => {
  const newUser = {...user, ...newValues}
  for (const i in newUser) {
    if (newUser[i] === '')
      delete newUser[i]
  }
  
  return newUser
}

const userUpdate = async (user, newValues, dispatch) => {
  const u = setUserUpdate(user, newValues)
  const res = await api.users.update(u)
  if (!res.error) {
    dispatch(actions.fillUser(u))
    toast.success('Changes saved')
  } else {
    toast.error('Something went wrong')
  }
}

const Page = withUsersAddGuard(() => {
  const dispatch = useDispatch();
  const me = useMe();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('common');
  const [timezones, setTimezones] = useState(null);
  const [user, setUser] = useState({
    "name": "",
    "email": "",
    "timezone": 180,
    "language": "en",
    "password": "",
    "company": "",
    "status": "active",
    "queues": [],
    "role": "client"
  });
  const [clients, setClients] = useState(null);
  const id = +router.query.user;
  const newUser = isNaN(id);
  const data = useUser(id);
  const {queues} = useProjects();
  console.log(queues);
  useEffect(() => {
    if (data.user) {
      setUser(data.user)
    }
    
    return () => {
      dispatch(actions.fillUser(null))
    }
  }, [dispatch, data, id])
  
  const getClients = useCallback(async () => {
    const {result, error} = await api.users.list({
      role: 'client',
      status: 'active',
      limit: 1000
    })
    if (result) {
      setClients(result.items)
    }
  }, [])
  
  useEffect(()=>{
    getClients()
  }, [])
  
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
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);
  
  const onCommonSubmit = useCallback(async (values) => {
    if (newUser) {
      try {
        const {result, error} = await api.users.add(setUserUpdate(user, values));
         if (result && !error) {
           router.replace('/users/' + result)
         } else {
           toast.error('Something went wrong')
         }
      } catch (e) {
        toast.error('Something went wrong')
      }
    } else {
      userUpdate(user, values, dispatch)
    }
  }, [user]);
  
  const handleAvatarUpload = useCallback((files) => {
    if (newUser) {
      setUser(state => ({
        ...state,
        avatar: root + files[0].path
      }))
    } else {
      userUpdate(user, {
        avatar: root + files[0].path
      }, dispatch)
    }
  }, [user, newUser]);
  
  return (
    <>
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
            >
              {!newUser && user.name}
            </Avatar>}
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
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                disabled={newUser && tab.value === 'common' ? false : newUser}
              />
            ))}
          </Tabs>
          <Divider/>
        </div>
      </Stack>
      {currentTab === 'common' && (
        <div>
          {((!newUser && user.id) || newUser) && me.user && <CommonTab
            user={user}
            userRole={me.user.role}
            isNew={newUser}
            onUpload={handleAvatarUpload}
            onSubmit={onCommonSubmit}
            timezones={timezones}
            clients={clients}
          />}
        </div>
      )}
      {/*{currentTab === 'queues' && <QueuesListTable queues={queues}/>}*/}
      {currentTab === 'operators' && ''}
    </>
  );
})

export default Page;

Page.defaultProps = {
  title: 'Users'
}
