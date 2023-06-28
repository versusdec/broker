import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { paths } from '../navigation/paths';
import {useMe} from "../hooks/useMe";
import {useGrants} from "../hooks/useGrants";

export const UsersAddGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const {data} = useMe();
  const grants = useGrants(data?.role_id);
  
  const check = useCallback(() => {
    if (data && (grants.length || data.role_id === 0)) {
      if (data.role_id === 0 || grants.includes('users.write')) {
        setChecked(true);
      } else {
        router.replace(paths.denied);
      }
    }
  }, [data, grants, router]);
  
  useEffect(() => {
    check()
  }, [data, grants, check])
  
  if(!checked)
    return null

  return <>{children}</>;
};

UsersAddGuard.propTypes = {
  children: PropTypes.node
};
