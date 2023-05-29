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
import {paths} from '../../navigation/paths';
import {CommonTab} from '../../components/projects/project-common';
import {useRouter} from 'next/router'
import {useMe} from "../../hooks/useMe";
import {api} from "../../api";
import {actions} from "../../slices/projectsSlice";
import toast from "react-hot-toast";
import {useDispatch} from "../../store";
import {withProjectsAddGuard} from "../../hocs/with-projects-add-guard";
import {useProject} from "../../hooks/useProject";
import {usePagination} from "../../hooks/usePagination";
import {FieldsListTable} from "../../components/projects/fields-list-table";
import {TagsList} from "../../components/projects/tags-list";

const tabs = [
  {label: 'Common', value: 'common'},
  {label: 'Fields', value: 'fields'},
  {label: 'Tags', value: 'tags'},
  // {label: 'Modules', value: 'modules'}
];

const setProjectUpdate = (project, newValues) => {
  const newProject = {...project, ...newValues}
  for (const i in newProject) {
    if (newProject[i] === '')
      delete newProject[i]
  }
  
  return newProject
}

const projectUpdate = async (project, newValues, dispatch) => {
  const u = setProjectUpdate(project, newValues)
  const res = await api.users.update(u)
  if (!res.error) {
    dispatch(actions.fillProject(u))
    toast.success('Changes saved')
  } else {
    toast.error('Something went wrong')
  }
}

const Page = withProjectsAddGuard(() => {
  const dispatch = useDispatch();
  const me = useMe();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('common');
  const [project, setProject] = useState({
    "name": "",
    "status": "active",
    "description": ""
  });
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  const [clients, setClients] = useState(null);
  const [fields, setFields] = useState({items: [], limit: 10, total: 0});
  const [tags, setTags] = useState([]);
  const id = +router.query.project;
  const newProject = isNaN(id);
  const data = useProject(id);
  
  const params = useMemo(() => {
    return {
      limit: limit, offset: offset,
    }
  }, [limit, page, offset]);
  
  useEffect(() => {
    if (data.project) {
      setProject(data.project)
    }
    
    return () => {
      dispatch(actions.fillProject(null))
    }
  }, [dispatch, data, id])
  
  const getClients = useCallback(async () => {
      const {result, error} = await api.users.list({
        role: 'client',
        status: 'active',
        limit: 1000
      })
      if (result) {
        setClients(result.items)
      }
  }, [])
  
  const getFields = useCallback(async () => {
    const {result, error} = await api.fields.list({
      project_id: id, ...params
    })
    if (result) {
      setFields(result)
    }
  }, [params, id])
  
  const getTags = useCallback(async () => {
    const {result, error} = await api.tags.list({
      project_id: id, status: 'active', limit: 1000
    })
    if (result) {
      setTags(result.items)
    }
  }, [])
  
  useEffect(() => {
    if (!!id) {
      getFields()
    }
  }, [params])
  
  useEffect(()=>{
    if (me.data && me.data.role_id === 0) {
      getClients();
    }
  }, [me])
  
  useEffect(() => {
    if (!!id) {
      getTags()
    }
  }, [id])
  
  const handleFieldEdit = useCallback(async (params, cb) => {
    const {result, error} = await api.fields.update(params);
    if (result) {
      cb()
      getFields()
    } else if (error) {
      toast.error(error.message)
    }
  }, [])
  
  const handleFieldAdd = useCallback(async (params, cb) => {
    const {result, error} = await api.fields.add(params)
    if (result) {
      cb()
      getFields()
    } else if (error) {
      toast.error(error.message)
    }
  }, [])
  
  const handleFieldStatus = useCallback(async (id, status) => {
    const {result, error} = await api.fields.update({id: id, status: status})
    if (result) {
      getFields()
    } else if (error) {
      toast.error(error.message)
    }
  }, [])
  
  const handleTagStatus = useCallback(async (id, status) => {
    const {result, error} = await api.tags.update({id: id, status: status})
    if (result) {
      getTags()
    } else if (error) {
      toast.error(error.message)
    }
  }, [])
  
  const handleTagEdit = useCallback(async (params, cb) => {
    const {result, error} = await api.tags.update(params);
    if (result) {
      cb()
      getTags()
    } else if (error) {
      toast.error(error.message)
    }
  }, [])
  
  const handleTagAdd = useCallback(async (params, cb) => {
    const {result, error} = await api.tags.add(params)
    if (result) {
      cb()
      getTags()
    } else if (error) {
      toast.error(error.message)
    }
  }, [])
  
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);
  
  const onCommonSubmit = useCallback(async (values) => {
    if (newProject) {
      try {
        const {result, error} = await api.projects.add(setProjectUpdate(project, values));
        if (result && !error) {
          router.replace('/projects/' + result)
        } else {
          toast.error('Something went wrong')
        }
      } catch (e) {
        toast.error('Something went wrong')
      }
    } else {
      projectUpdate(project, values, dispatch)
    }
  }, [project]);
  
  return (<>
    <Stack spacing={4} mb={3}>
      <div>
        <Link
          color="text.primary"
          component={NextLink}
          href={paths.projects.index}
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
            Projects
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
          <Stack>
            <Typography variant="h4">
              {newProject && 'Add project'}
              {!newProject && project && project.name}
            </Typography>
            {!newProject && project && <>
              <Typography variant="body2" color={'text.secondary'}>
                {project.description}
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
                  label={project.id}
                  size="small"
                />
              </Stack>
            </>}
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
              disabled={newProject && tab.value === 'common' ? false : newProject}
            />
          ))}
        </Tabs>
        <Divider/>
      </div>
    </Stack>
    {currentTab === 'common' && clients && (
      <div>
        {((!newProject && project.id) || newProject) && me.data && <CommonTab
          project={project}
          userRole={data.role_id}
          isNew={newProject}
          onSubmit={onCommonSubmit}
          clients={clients}
        />}
      </div>
    )}
    {currentTab === 'fields' && <FieldsListTable
      items={fields.items}
      total={fields.total}
      onPageChange={handlePageChange}
      handleLimitChange={handleLimitChange}
      handleAdd={handleFieldAdd}
      handleEdit={handleFieldEdit}
      handleStatus={handleFieldStatus}
      limit={limit}
      page={page}
      projectId={id}
    />}
    {currentTab === 'tags' && <TagsList
      items={tags} handleAdd={handleTagAdd}
      handleEdit={handleTagEdit}
      handleStatus={handleTagStatus}
      projectId={id}/>}
  </>);
})

export default Page;

Page.defaultProps = {
  title: 'Projects'
}
