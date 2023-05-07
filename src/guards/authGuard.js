import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import { paths } from '../navigation/paths';
import {getToken} from "../utils/get-token";

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [checked, setChecked] = useState(false);
  const token = getToken();

  const check = useCallback(() => {

    if (!isAuthenticated || !token) {
      const searchParams = new URLSearchParams({ returnTo: globalThis.location.href }).toString();
      const href = paths.login + `?${searchParams}`;
      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router, token]);

  useEffect(() => {
      check();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};
