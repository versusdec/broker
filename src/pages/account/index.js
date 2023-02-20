import {useCallback, useState} from 'react';
import Head from 'next/head';
import {subDays, subHours, subMinutes, subMonths} from 'date-fns';
import {Box, Container, Divider, Stack, Tab, Tabs, Typography} from '@mui/material';
import {Layout as DashboardLayout} from '../../layouts/dashboard';
import {AccountGeneralSettings} from '../../components/account/account-general-settings';
import {AccountSecuritySettings} from '../../components/account/account-security-settings';

const user = {
  id: '5e86809283e28b96d2d38537',
  avatar: '/assets/avatars/avatar-anika-visser.png',
  name: 'Anika Visser',
  email: 'anika.visser@devias.io',
  timezone: 2,
  language: 'en'
};

const now = new Date();

const tabs = [
  {label: 'General', value: 'general'},
  {label: 'Security', value: 'security'}
];

const Page = () => {

  
  const [currentTab, setCurrentTab] = useState('general');
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);
  
  const handleGeneralSubmit = (values) => {
    console.log(values);
  }
  
  return (
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
            user={user} onSubmit={handleGeneralSubmit}
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
