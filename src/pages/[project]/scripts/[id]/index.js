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
  Typography
} from '@mui/material';
import {CommonTab} from '../../../../components/scripts/common-tab';
import {StepsTab} from '../../../../components/scripts/steps-tab';
import {useScript} from "../../../../hooks/useScript";
import {useRouter} from 'next/router';
import {useMe} from "../../../../hooks/useMe";
import {api} from "../../../../api";
import {actions} from "../../../../slices/scriptsSlice";
import toast from "react-hot-toast";
import {useDispatch} from "../../../../store";
import {withScriptsAddGuard} from "../../../../hocs/with-scripts-add-guard";
import * as Yup from "yup";
import {useFormik} from "formik";
import {wait} from "../../../../utils/wait";
import {useFields} from "../../../../hooks/useFields";

const tabs = [
  {label: 'Common', value: 'common'},
  {label: 'Steps', value: 'steps'},
  {label: 'Statuses', value: 'statuses'},
];

const Page = withScriptsAddGuard(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const me = useMe();
  const [currentTab, setCurrentTab] = useState('steps');
  const project_id = +router.query.project;
  const id = +router.query.id;
  const isNew = isNaN(id);
  const {data} = useScript(id);
  const fieldsParams = useMemo(()=>({project_id: project_id, limit: 1000}), [])
  const fields = useFields(fieldsParams);

  const [script, setScript] = useState({
    project_id: project_id,
    name: '',
    is_default: false,
    steps: [],
    statuses: [],
    // qualification: [],
    status: 'active'
  });
  
  useEffect(() => {
    if (data) {
      setScript(data);
    }
    
    return () => {
      dispatch(actions.fillScript(null))
    }
  }, [dispatch, data, id])
  
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);
  
  const handleValuesChange = (value) => {
    setScript(prev => {
      return {
        ...prev,
        ...value
      }
    })
  };
  
  const onSubmit = useCallback(async () => {
    console.log(script)
    /*try {
      const {result, error} = await api.scripts[isNew ? 'add' : 'update'].add(script);
      if (result && !error) {
        if (isNew) {
          toast.success('Script has been created')
          await wait(500);
          router.replace(`/${project_id}/scripts`)
        } else {
          toast.success('Script has been updated')
        }
      } else {
        toast.error('Something went wrong')
      }
    } catch (e) {
      console.log(e)
    }*/
  }, [script]);
  
  const initialValues = useMemo(() => script, [script]);
  const validationSchema = Yup.object({
    name: Yup
      .string()
      .max(255)
      .required('Name is required'),
    status: Yup
      .string()
      .oneOf(['active', 'archived']),
  });
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: (values, helpers) => {
      try {
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
              href={`/${project_id}/scripts`}
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
                Scripts
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
                {isNew && 'Add script'}
                {!isNew && script && script.name}
              </Typography>
              {!isNew && script && <>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Typography variant="subtitle2">
                    ID:
                  </Typography>
                  <Chip
                    label={script.id}
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
                />
              ))}
            </Tabs>
            <Divider/>
          </div>
        </Stack>
        {currentTab === 'common' && (
          <div>
            {((!isNew && script.id) || isNew) && <CommonTab
              item={script}
              onSubmit={onSubmit}
              onChange={handleValuesChange}
              formik={formik}
            />}
          </div>
        )}
        {currentTab === 'steps' && <StepsTab
          onSubmit={onSubmit}
          item={script}
          fields={fields.data}
          formik={formik}
          changeTab={handleTabsChange}
        />}
      </>}
    </>
  );
})

export default Page;

Page.defaultProps = {
  title: 'Scripts'
}
