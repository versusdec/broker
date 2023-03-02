import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {VerticalLayout} from './vertical-layout';
import {getSections} from './config';
import Head from '../../components/head'
import {AuthGuard} from "../../guards/authGuard";

const useTranslatedSections = () => {
  const {t} = useTranslation();
  
  return useMemo(() => getSections(t), [t]);
};

export const Layout = (props) => {
  const sections = useTranslatedSections();
  const title = props.title
    ? props.title
    : props.children?.props.title
      ? props.children.props.title
      : false
  
  return (
    <AuthGuard>
      <Head title={title}/>
      <VerticalLayout
        sections={sections}
        {...props} />
    </AuthGuard>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};
