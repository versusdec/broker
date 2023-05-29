import {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import PropTypes from 'prop-types';
import {paths} from '../navigation/paths';
import {useMe} from "../hooks/useMe";
import {getGrants} from "../utils/get-role-grants";

export const ProjectsAddGuard = (props) => {
  const {children} = props;
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const {data} = useMe();
  const grants = getGrants(data?.role_id);
  
  const check = useCallback(() => {
    // console.log(data);
    if (data) {
      if (data.role_id === 0 || grants.includes('projects.write')) {
        setChecked(true);
      } else {
        router.replace(paths.projects.index);
      }
    }
  }, [data, grants]);
  
  useEffect(() => {
    check()
  }, [data, grants])
  
  if (!checked)
    return null
  
  return <>{children}</>;
};

ProjectsAddGuard.propTypes = {
  children: PropTypes.node
};
