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
  
  return newUser
}

const userUpdate = async (user, newValues, dispatch)=>{
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
  const {user} = useMe();
  const dispatch = useDispatch()
  
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
  
  const accountGeneralSettingsProps = {
    user:user, onSubmit: handleGeneralSubmit, onUpload: handleAvatarUpload
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
          onUpdate={handleSecuritySubmit}
        />
      )}
    </Box>
  </>;
};

Page.defaultProps = {
  title: 'Account'
}

export default Page;
