import {useCallback, useEffect, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Box, Button, Card, Container, Stack, SvgIcon, Typography} from '@mui/material';
import {customersApi} from '../../api/customers'
import {UserListTable} from '../../components/users/user-list-table';
import NextLink from "next/link";
import {paths} from "../../navigation/paths";

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      query: undefined,
      hasAcceptedMarketing: undefined,
      isProspect: undefined,
      isReturning: undefined
    },
    page: 0,
    rowsPerPage: 5,
    sortBy: 'updatedAt',
    sortDir: 'desc'
  });
  
  return {
    search,
    updateSearch: setSearch
  };
};

const useCustomers = (search) => {
  const [state, setState] = useState({
    users: [],
    usersCount: 0
  });
  
  const getCustomers = useCallback(async () => {
    try {
      const response = await customersApi.getCustomers(search);
      
      setState({
        users: response.data,
        usersCount: response.count
      });
      
    } catch (err) {
      console.error(err);
    }
  }, [search]);
  
  useEffect(() => {
      getCustomers();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]);
  
  return state;
};

const Page = () => {
  const {search, updateSearch} = useSearch();
  const {users, usersCount} = useCustomers(search);
  
  const handleFiltersChange = useCallback((filters) => {
    updateSearch((prevState) => ({
      ...prevState,
      filters
    }));
  }, [updateSearch]);
  
  const handlePageChange = useCallback((event, page) => {
    updateSearch((prevState) => ({
      ...prevState,
      page
    }));
  }, [updateSearch]);
  
  const handleRowsPerPageChange = useCallback((event) => {
    updateSearch((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10)
    }));
  }, [updateSearch]);
  
  return (
    <>
      <Stack spacing={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}
        >
          <Stack spacing={1}>
            <Typography variant="h4">
              Users
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={3}
          >
            <Button
              component={NextLink}
              href={paths.users.edit}
              startIcon={(
                <SvgIcon>
                  <PlusIcon/>
                </SvgIcon>
              )}
              variant="contained"
            >
              Add
            </Button>
          </Stack>
        </Stack>
        <Card>
          <UserListTable
            users={users}
            usersCount={usersCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPage={search.rowsPerPage}
            page={search.page}
          />
        </Card>
      </Stack>
    </>
  );
};

Page.defaultProps = {
  title: 'Users'
};

export default Page;
