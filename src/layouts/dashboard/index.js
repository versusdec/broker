import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {VerticalLayout} from './vertical-layout';
import {getSections} from './config/common';
import Head from '../../components/head'
import {withAuthGuard} from "../../hocs/with-auth-guard";
import {useRoles} from "../../hooks/useRoles";

export const Layout = withAuthGuard((props) => {
  const {t} = useTranslation();
  const roles = useRoles(useMemo(()=>({limit: 1000, status: 'active'}), []))
  
  const commonSections = getSections(t, roles.data?.items);
  
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
