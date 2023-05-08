import {useCallback, useEffect, useMemo, useState} from 'react';
import NextLink from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
  Chip,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {CommonTab} from '../../../../components/queue/common-tab';
import {UsersTab} from '../../../../components/queue/users-tab';
import {useQueue} from "../../../../hooks/useQueue";
import {useRouter} from 'next/router';
import {useMe} from "../../../../hooks/useMe";
import {api} from "../../../../api";
import {actions} from "../../../../slices/queuesSlice";
import toast from "react-hot-toast";
import {useDispatch} from "../../../../store";
import {withQueuesAddGuard} from "../../../../hocs/with-queues-add-guard";
import {wait} from "../../../../utils/wait";
import * as Yup from "yup";
import {useFormik} from "formik";

const tabs = [
  {label: 'Common', value: 'common'},
  {label: 'Users', value: 'users'},
];

const setUpdate = (values, newValues) => {
  const val = {...values, ...newValues}
  for (const i in val) {
    if (val[i] === '')
      delete val[i]
  }
  
  return val
}

const itemUpdate = async (values, newValues, dispatch) => {
  const v = setUpdate(values, newValues)
  const res = await api.users.update(v)
  if (!res.error) {
    dispatch(actions.fillQueue(v))
    toast.success('Changes saved')
  } else {
    toast.error('Something went wrong')
  }
}

const Page = withQueuesAddGuard(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const me = useMe();
  const [currentTab, setCurrentTab] = useState('common');
  const [usersList, setUsersList] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const id = +router.query.id;
  const project = +router.query.project;
  const isNew = isNaN(id);
  const {data, loading, error} = useQueue(id);
  const [queue, setQueue] = useState({
    project_id: project,
    name: '',
    description: '',
    users: [],
    status: 'active'
  });
  
  useEffect(() => {
    if (data) {
      console.log(data);
      setQueue(data);
    }
    
    return () => {
      dispatch(actions.fillQueue(null))
    }
  }, [dispatch, data, id])
  
  const getUsers = useCallback(async () => {
    const {result, error} = await api.users.list({
      role: 'operator',
      status: 'active',
      limit: 1000
    })
    if (result) {
      setUsers(result.items)
    }
  }, [queue])

  const queueUsers = useCallback(() => {
    const u = []
    queue.users.forEach((id) => {
      u.push(usersList.find(u => (u.id === id)))
    })
    setSelectedUsers(u)
  }, [users])
  
  useEffect(() => {
    queueUsers();
  }, [])
  
  useEffect(() => {
    getUsers();
  }, [])
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);
  
  const handleValuesChange = useCallback((value) => {
    setQueue(prev => {
      return {
        ...prev,
        ...value
      }
    })
  }, [queue]);
  
  const onSubmit = useCallback(async () => {
    console.log(queue)
    /* if (isNew) {
       try {
         const {result, error} = await api.queues.add(setUpdate(queue, values));
         if (result && !error) {
           toast.success('Queue has been created')
           await wait(500);
           router.replace(`/${project}/queues`)
         } else {
           toast.error('Something went wrong')
         }
       } catch (e) {
         toast.error('Something went wrong')
       }
     } else {
       itemUpdate(queue, values, dispatch)
     }*/
  }, [queue]);
  
  const initialValues = useMemo(() => queue, [queue]);
  const validationSchema = Yup.object({
    name: Yup
      .string()
      .max(255)
      .required('Name is required'),
    description: Yup
      .string()
      .max(255),
    status: Yup
      .string()
      .oneOf(['active', 'archived']),
    users: Yup
      .array().of(Yup.number())
  });
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: (values, helpers) => {
      try {
        // console.log(values)
        onSubmit()
      } catch (err) {
        console.error(err);
        
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    }
  })
  
  return (
    <>
      {<>
        <Stack spacing={4} mb={3}>
          <div>
            <Link
              color="text.primary"
              component={NextLink}
              href={`/${project}/queues`}
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
                Queues
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
            <Stack>
              <Typography variant="h4">
                {isNew && 'Add queue'}
                {!isNew && queue && queue.name}
              </Typography>
              {!isNew && queue && <>
                <Typography variant="body2" color={'text.secondary'}>
                  {queue.description}
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
                    label={queue.id}
                    size="small"
                  />
                </Stack>
              </>}
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
                  // disabled={isNew && tab.value === 'common' ? false : isNew}
                />
              ))}
            </Tabs>
            <Divider/>
          </div>
        </Stack>
        {currentTab === 'common' && (
          <div>
            {((!isNew && queue.id) || isNew) && me.user && <CommonTab
              item={queue}
              onSubmit={onSubmit}
              onChange={handleValuesChange}
              formik={formik}
            />}
          </div>
        )}
        {currentTab === 'users' && <UsersTab
          onSubmit={onSubmit}
          users={users}
          selected={selectedUsers}
          onChange={handleValuesChange}
          formik={formik}
        />}
      </>}
    </>
  );
})

export default Page;

Page.defaultProps = {
  title: 'Users'
}
