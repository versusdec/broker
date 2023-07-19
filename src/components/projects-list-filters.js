import {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {Box, Divider, InputAdornment, OutlinedInput, Stack, SvgIcon, Tab, Tabs} from '@mui/material';
// import { useUpdateEffect } from '../../../hooks/use-update-effect';

const tabs = [
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Archived',
    value: 'archived'
  }
];

export const ProjectsListFilters = (props) => {
  const {onFiltersChange, initialFilters} = props;
  const queryRef = useRef(null);
  const [currentTab, setCurrentTab] = useState('active');
  const [filters, setFilters] = useState(initialFilters);
  const handleFiltersUpdate = useCallback(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);
  
  useEffect(() => {
    handleFiltersUpdate();
  }, [filters, handleFiltersUpdate]);
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
    setFilters((prevState) => {
      return {
        ...prevState,
        status: value
      };
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
      <Box hidden>
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
              placeholder="Search projects"
              startAdornment={(
                <InputAdornment position="start">
                  <SvgIcon>
                    <SearchMdIcon/>
                  </SvgIcon>
                </InputAdornment>
              )}
            />
          </Box>
        </Stack>
      </Box>
    </>
  );
};

ProjectsListFilters.propTypes = {
  onFiltersChange: PropTypes.func
};
