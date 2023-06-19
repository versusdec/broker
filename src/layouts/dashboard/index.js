import {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {VerticalLayout} from './vertical-layout';
import {getSections} from './config/common';
// import {getSections as projectSections} from './config/project';
import Head from '../../components/head'
import {withAuthGuard} from "../../hocs/with-auth-guard";
import {useRouter} from "next/router";
import {api} from "../../api";
import {useProject} from "../../hooks/useProject";

export const Layout = withAuthGuard((props) => {
  const [project, setProject] = useState(null)
  const router = useRouter();
  const id = +router.query.project;
  const {t} = useTranslation();
  
  const getProject = useCallback(async (id) => {
    const {result} = await api.projects.get(id);
    if (result)
      setProject(result)
  }, [])
  
  useEffect(() => {
    if (id) {
      getProject(id)
    }
  }, [id, getProject])
  
  const commonSections = getSections(t, project);
  
  const title = props.title
    ? props.title
    : props.children?.props.title
      ? props.children.props.title
      : false
  
  return (
    <>
      <Head title={title}/>
      <VerticalLayout
        sections={commonSections}
        {...props} />
    </>
  );
})

Layout.propTypes = {
  children: PropTypes.node
};
