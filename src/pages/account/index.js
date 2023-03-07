import {useCallback, useState} from 'react';
import {subDays, subHours, subMinutes, subMonths} from 'date-fns';
import {Box, Divider, Stack, Tab, Tabs, Typography} from '@mui/material';
import {AccountGeneralSettings} from '../../components/account/account-general-settings';
import {AccountSecuritySettings} from '../../components/account/account-security-settings';
import {useMe} from "../../hooks/useMe";
import {api} from "../../api";
import {root} from "../../api/config";
import {actions} from "../../slices/usersSlice";
import toast from "react-hot-toast";
import {useDispatch} from "../../store";

const now = new Date();

const tabs = [
  {label: 'General', value: 'general'},
  {label: 'Security', value: 'security'}
];

const setUserUpdate = (user, newValues) => {
  const newUser = {...user, ...newValues}
  for (const i in newUser) {
    if (newUser[i] === '')
      delete newUser[i]
  }
  //todo remove after cleaning up stepka mistakes for all users queues
  // delete newUser.queues;
  // newUser.queues = [];
  //------------------
  return newUser
}

const userUpdate = async (user, newValues, dispatch)=>{
  const u = setUserUpdate(user, newValues)
  const res = await api.users.update(u)
  if (!res.error) {
    dispatch(actions.fillMe(u))
  } else {
    toast.error('Something went wrong')
  }
}

const Page = () => {
  const [currentTab, setCurrentTab] = useState('general');
  const user = useMe();
  const dispatch = useDispatch()
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);
  
  const handleGeneralSubmit = useCallback((values) => {
    userUpdate(user, values, dispatch)
  }, [user, dispatch])
  
  const handleAvatarUpload = useCallback((files) => {
    userUpdate(user, {
      avatar: root + files[0].path
    }, dispatch)
  }, [user, dispatch])
  
  const accountGeneralSettingsProps = {
    user:user, onSubmit: handleGeneralSubmit, updateAvatar: handleAvatarUpload
  }
  
  return user && (
    <>
      <Box>
        <Stack
          spacing={3}
          sx={{mb: 3}}
        >
          <Typography variant="h4">
            Account
          </Typography>
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
          <AccountGeneralSettings
            {...accountGeneralSettingsProps}
          />
        )}
        {currentTab === 'security' && (
          <AccountSecuritySettings
            loginEvents={[
              {
                id: '1bd6d44321cb78fd915462fa',
                createdAt: subDays(subHours(subMinutes(now, 5), 7), 1).getTime(),
                ip: '95.130.17.84',
                type: 'Credential login',
                userAgent: 'Chrome, Mac OS 10.15.7'
              },
              {
                id: 'bde169c2fe9adea5d4598ea9',
                createdAt: subDays(subHours(subMinutes(now, 25), 9), 1).getTime(),
                ip: '95.130.17.84',
                type: 'Credential login',
                userAgent: 'Chrome, Mac OS 10.15.7'
              }
            ]}
          />
        )}
      </Box>
    </>
  );
};

Page.defaultProps = {
  title: 'Account'
}

export default Page;
