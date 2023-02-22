import {useCallback, useEffect, useState} from 'react';
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

const tabs = [
  {label: 'Common', value: 'common'},
  {label: 'Queues', value: 'queues'},
  {label: 'Operators', value: 'operators'}
];

const useUser = () => {
  const [user, setUser] = useState(null);
  
  const getUser = useCallback(async () => {
    try {
      const response = await customersApi.getCustomer();
      setUser(response);
      
    } catch (err) {
      console.error(err);
    }
  }, []);
  
  useEffect(() => {
      getUser();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
  
  return user;
};

const useQueues = () => {
  const [queues, setQueues] = useState([]);
  
  const getLogs = useCallback(async () => {
    try {
      const response = await customersApi.getLogs();
      setQueues(response);
      
    } catch (err) {
      console.error(err);
    }
  }, []);
  
  useEffect(() => {
      getLogs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
  
  return queues;
};

const useOperators = () => {
  const [operators, setOperators] = useState([]);
  
  const getLogs = useCallback(async () => {
    try {
      const response = await customersApi.getLogs();
      setOperators(response);
      
    } catch (err) {
      console.error(err);
    }
  }, []);
  
  useEffect(() => {
      getLogs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
  
  return operators;
};

const Page = () => {
  const [currentTab, setCurrentTab] = useState('common');
  const user = useUser();
  const queues = useQueues();
  const operators = useOperators();
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);
  
  const onSettingsSubmit = (values) => {
    console.log(values);
  }
  
  return user && (
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
            <Avatar
              src={user.avatar}
              sx={{
                height: 64,
                width: 64
              }}
            >
              {user.name}
            </Avatar>
            <Stack>
              <Typography variant="h4">
                {user.name}
              </Typography>
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
              />
            ))}
          </Tabs>
          <Divider/>
        </div>
      </Stack>
      {currentTab === 'common' && (
        <div>
          <CommonTab user={user} onSubmit={onSettingsSubmit}/>
        </div>
      )}
      {currentTab === 'queues' && ''}
      {currentTab === 'operators' && ''}
    </>
  );
};

Page.defaultProps = {
  title: 'User'
}

export default Page;

