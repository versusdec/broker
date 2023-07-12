import {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {Box, Divider, InputAdornment, MenuItem, OutlinedInput, Stack, SvgIcon, Tab, Tabs} from '@mui/material';
import {Input} from "./input";

const tabs = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Blocked',
    value: 'blocked'
  }
];

export const UsersListFilters = ({role, ...props}) => {
  const {onFiltersChange} = props;
  const queryRef = useRef(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [filters, setFilters] = useState(props.initialFilters);
  
  const handleFiltersUpdate = useCallback(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);
  
  useEffect(() => {
    handleFiltersUpdate();
  }, [filters, handleFiltersUpdate]);
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
    setFilters((prevState) => {
      const values = {
        ...prevState,
        status: value
      }
      
      if (value === 'all')
        delete values.status
      
      return values;
    });
  }, []);
  
  const handleQueryChange = useCallback((event) => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      q: queryRef.current?.value
    }));
  }, []);
  
  return (
    <>
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        sx={{px: 3}}
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
      
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={3}
        sx={{p: 3}}
      >
        <Box
          component="form"
          onSubmit={handleQueryChange}
          sx={{flexGrow: 1}}
        >
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputProps={{ref: queryRef}}
            placeholder="Search by name or email"
            startAdornment={(
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon/>
                </SvgIcon>
              </InputAdornment>
            )}
          />
        </Box>
        <Input
          select
          value={role ?? ''}
          label={'Role'}
        >
          <MenuItem>
          
          </MenuItem>
        </Input>
      </Stack>
    </>
  );
};

UsersListFilters.propTypes = {
  onFiltersChange: PropTypes.func
};
