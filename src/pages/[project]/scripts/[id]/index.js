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
import {StatusesTab} from "../../../../components/scripts/statuses-tab";

const tabs = [
  {label: 'Common', value: 'common'},
  {label: 'Steps', value: 'steps'},
  {label: 'Statuses', value: 'statuses'},
];

const initialStep = {
  "title": "",
  "text": "",
  "id": 1,
  "next": [
    {
      "step_id": 1,
      "answer": ""
    }
  ],
  "field_id": ""
}

const initialStatus = {
  "label": "",
  "name": "",
  "actions": [
    {
      "name": "assign_recall"
    }
  ]
}

const Page = withScriptsAddGuard(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const me = useMe();
  const [currentTab, setCurrentTab] = useState('common');
  const projectId = +router.query.project;
  const id = +router.query.id;
  const isNew = isNaN(id);
  const {data} = useScript(id);
  const fieldsParams = useMemo(() => ({project_id: projectId, limit: 1000}), [projectId])
  const fields = useFields(fieldsParams);
  
  const [script, setScript] = useState(data ?? {
    project_id: projectId,
    name: '',
    is_default: false,
    steps: [initialStep],
    statuses: [initialStatus],
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
  
  const handleValuesChange = useCallback((value) => {
    setScript(prev => {
      return {
        ...prev,
        ...value
      }
    })
  }, [])
  
  const onSubmit = useCallback(async () => {
    try {
      const {result, error} = await api.scripts[isNew ? 'add' : 'update'](script);
      if (result && !error) {
        if (isNew) {
          toast.success('Script has been created')
          await wait(500);
          router.replace(`/${projectId}/scripts`)
        } else {
          toast.success('Script has been updated')
        }
      } else {
        toast.error('Something went wrong')
      }
    } catch (e) {
      console.log(e)
    }
  }, [script, isNew, projectId, router]);
  
  const initialValues = useMemo(() => script, [script]);
  const validationSchema = Yup.object({
    name: Yup
      .string()
      .max(255)
      .required('Name is required'),
    status: Yup
      .string()
      .oneOf(['active', 'archived']),
    statuses: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Name required"),
        label: Yup.string().required("Label required"),
        actions: Yup.array().of(
          Yup.object().shape({
            name: Yup.string(),
          })
        )
      })
    )
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
              href={`/${projectId}/scripts`}
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
              changeTab={handleTabsChange}
              formik={formik}
            />}
          </div>
        )}
        {currentTab === 'steps' && fields.data && <StepsTab
          onSubmit={onSubmit}
          item={script}
          fields={Array.isArray(fields.data.items) ? fields.data.items : []}
          formik={formik}
          changeTab={handleTabsChange}
          initialStep={initialStep}
          onChange={handleValuesChange}
        />}
        {currentTab === 'statuses' && <StatusesTab
          onSubmit={onSubmit}
          item={script}
          formik={formik}
          changeTab={handleTabsChange}
          initialStatus={initialStatus}
          onChange={handleValuesChange}
        />}
      </>}
    </>
  );
})

export default Page;

Page.defaultProps = {
  title: 'Scripts'
}
