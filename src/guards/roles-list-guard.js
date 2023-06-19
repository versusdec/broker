import {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import PropTypes from 'prop-types';
import {useMe} from "../hooks/useMe";

export const RolesListGuard = (props) => {
  
  const {children} = props;
  const [checked, setChecked] = useState(false);
  const me = useMe();
  const router = useRouter();
  
  const check = useCallback(() => {
    if (me && me.user && !['admin', 'client'].includes(me.user.role)) {
      router.replace('/404');
    } else {
      setChecked(true);
    }
  }, [me, router]);
  
  useEffect(() => {
    check()
  }, [me, check])
  
  if (!checked)
    return null
  
  return <>{children}</>;
};

RolesListGuard.propTypes = {
  children: PropTypes.node
};
