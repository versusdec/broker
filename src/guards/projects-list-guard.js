import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { paths } from '../navigation/paths';
import {useMe} from "../hooks/useMe";

export const ProjectsListGuard = (props) => {
  const { children } = props;
  const [checked, setChecked] = useState(false);
  const me = useMe();
  const router = useRouter();
  
  const check = useCallback(() => {
    if (me && me.user && !['client', 'admin', 'supervisor'].includes(me.user.role)) {
      router.replace('/404');
    } else {
      setChecked(true);
    }
  }, [me]);
  
  useEffect(()=>{
    check()
  }, [me])
  
  if(!checked)
    return null

  return <>{children}</>;
};

ProjectsListGuard.propTypes = {
  children: PropTypes.node
};
