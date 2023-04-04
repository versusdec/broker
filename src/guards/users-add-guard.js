import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { paths } from '../navigation/paths';
import {useMe} from "../hooks/useMe";

export const UsersAddGuard = (props) => {
  const { children } = props;
  const [checked, setChecked] = useState(false);
  const me = useMe();
  const router = useRouter();
  
  const check = useCallback(() => {
    if (me && me.user && !['client', 'admin'].includes(me.user.role)) {
      router.replace(paths.users.index);
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

UsersAddGuard.propTypes = {
  children: PropTypes.node
};
