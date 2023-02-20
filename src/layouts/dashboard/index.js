import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {VerticalLayout} from './vertical-layout';
import {getSections} from './config';

const useTranslatedSections = () => {
  const {t} = useTranslation();
  
  return useMemo(() => getSections(t), [t]);
};

export const Layout = (props) => {
  const sections = useTranslatedSections();
  
  return (
    <VerticalLayout
      sections={sections}
      {...props} />
  );
};

Layout.propTypes = {
  children: PropTypes.node
};
