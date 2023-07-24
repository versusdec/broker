import {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {Box, Divider, InputAdornment, MenuItem, OutlinedInput, Stack, SvgIcon, Tab, Tabs} from '@mui/material';
import {Input} from "./input";
import {paths} from "../navigation/paths";
import {useRouter} from "next/router";

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

export const UsersListFilters = ({role, roles, ...props}) => {
  const {onFiltersChange} = props;
  const router = useRouter();
  const queryRef = useRef(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [filters, setFilters] = useState(props.initialFilters);
  const theRole = roles && roles.find(r => (r.id === +role))

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
        <Box width={82}>
          <Input
            fullWidth
            select
            value={role !== '' ? `${paths.users.index + theRole.name}/${role}/` : role}
            label={'Role'}
            onChange={e => {
              router.replace(e.target.value)
            }}
            options={roles}
          >
            <MenuItem value={paths.users.index}>All</MenuItem>
            {roles && roles.map(item=>(<MenuItem key={item.id} value={paths.users.index + item.name + `/${item.id}/`}>{item.name}</MenuItem>))}
          </Input>
        </Box>
        <Box width={112}>
          <Input
            fullWidth
            select
            value={''}
            label={'Manager'}
            onChange={e => {
            
            }}
          >
            <MenuItem value={''}>All</MenuItem>
          </Input>
        </Box>
        <Box width={96}>
          <Input
            fullWidth
            select
            value={filters.status ?? ''}
            label={'Status'}
            onChange={e => {
              const f = {...filters}
              e.target.value === '' ? delete f.status : f.status = e.target.value;
              onFiltersChange(f)
            }}
          >
            <MenuItem value={''}>All</MenuItem>
            <MenuItem value={'active'}>Active</MenuItem>
            <MenuItem value={'blocked'}>Blocked</MenuItem>
          </Input>
        </Box>
      
      </Stack>
    </>
  );
};

UsersListFilters.propTypes = {
  onFiltersChange: PropTypes.func
};
