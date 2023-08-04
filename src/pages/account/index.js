import {useCallback, useEffect, useState} from 'react';
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
import {useGrants} from "../../hooks/useGrants";
import {AccountNotificationsSettings} from "../../components/account/account-notifications-settings";

const tabs = [
  {label: 'Details', value: 'general'},
  {label: 'Security', value: 'security'},
  {label: 'Notifications', value: 'notifications'},
];

const setUserUpdate = (user, newValues) => {
  const newUser = {...user, ...newValues}
  newUser.phone === '' ? delete newUser.phone : newUser.phone = newUser.phone.replace(/[^0-9]/g, '');
  for (const key in newUser) {
    if (newUser[key] === '' && key !== 'avatar')
      delete newUser[key]
  }
  
  return newUser
}

const userUpdate = async (user, newValues, dispatch) => {
  const u = setUserUpdate(user, newValues)
  const res = await api.users.update(u)
  if (!res.error) {
    dispatch(actions.fillMe(u))
    toast.success('Changes saved')
  } else {
    toast.error('Something went wrong')
  }
}

const Page = () => {
  const [currentTab, setCurrentTab] = useState('general');
  const [user, setUser] = useState(null);
  const {data} = useMe();
  const dispatch = useDispatch();
  const grants = useGrants(data?.role_id);
  const editGrant = grants.includes('users.write');
  const isAdmin = data && data.role_id === 0;
  
  useEffect(() => {
    if (data) {
      setUser({...data, email_verified: true, phone_verified: false})
    }
  }, [data])
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);
  
  const handleGeneralSubmit = useCallback((values) => {
    userUpdate(user, values, dispatch)
  }, [user, dispatch])
  
  const handleSecuritySubmit = useCallback((values) => {
    userUpdate(user, values, dispatch)
  }, [user, dispatch])
  
  const handleAvatarUpload = useCallback((files) => {
    userUpdate(user, {
      avatar: root + files[0].path
    }, dispatch)
  }, [user, dispatch])
  
  const handleAvatarRemove = useCallback(() => {
    userUpdate(user, {
      avatar: ''
    }, dispatch)
  }, [user, dispatch])
  
  const accountGeneralSettingsProps = {
    user: user, onSubmit: handleGeneralSubmit, onUpload: handleAvatarUpload, onRemove: handleAvatarRemove, editGrant, isAdmin
  }
  
  return user && <>
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
          user={user}
          onUpdate={handleSecuritySubmit}
          isAdmin={isAdmin}
          editGrant={editGrant}
        />
      )}
      {currentTab === 'notifications' && (
        <AccountNotificationsSettings
          user={user}
        />
      )}
    
    </Box>
  </>;
};

Page.defaultProps = {
  title: 'Account'
}

export default Page;
