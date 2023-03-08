import {createContext, useCallback, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {api} from '../api';
import {getToken} from '../utils/get-token'
import {useRouter} from "next/router";
import {setToken} from "../utils/set-token";
import {domain} from "../api/config";
import {paths} from "../navigation/paths";
import {useSearchParams} from "next/navigation";
import toast from "react-hot-toast";

let ActionType = {
  'INITIALIZE': 'INITIALIZE',
  'LOGIN': 'LOGIN',
  'LOGIN2FA': 'LOGIN2FA',
  'LOGOUT': 'LOGOUT',
  'REGISTER': 'REGISTER'
}

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const {isAuthenticated, user} = action.payload;
    
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const {user} = action.payload;
    
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGIN2FA: (state, action) => {
    const {user} = action.payload;
    
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
};

const reducer = (state, action) => (handlers[action.type]
  ? handlers[action.type](state, action)
  : state);

export const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  login2fa: () => Promise.resolve(),
  logout: () => void 0,
  register: () => Promise.resolve(),
});

const useParams = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || undefined;
  
  return {
    returnTo
  };
};

export const AuthProvider = (props) => {
  const {children} = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const {returnTo} = useParams();
  
  const initialize = useCallback(async () => {
    try {
      const accessToken = getToken();
      
      if (accessToken) {
        const {result} = await api.users.me();
        const user = result;
        
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user
          }
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }, [dispatch]);
  
  useEffect(() => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
  
  const login = useCallback(async (values) => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.auth.login(values);
      const {result, error} = await res.json();
      setLoading(false);
      if (result && !error) {
        if (result.method === 'login2fa') {
          return result
        } else {
          if (res.headers.get('token') != null) {
            const user = result
            setToken(res.headers.get('token'))
            dispatch({
              type: ActionType.LOGIN,
              payload: {
                user
              }
            });
            router.push(returnTo || paths.index);
          }
        }
      } else if (error) {
        setError(error)
      }
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong')
    }
  }, [dispatch]);
  
  const login2fa = useCallback(async (values) => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.auth.login2fa(values);
      const {result, error} = await res.json();
      setLoading(false);
      const user = result
      if (result && !error) {
        if (res.headers.get('token') != null) {
          setToken(res.headers.get('token'))
          dispatch({
            type: ActionType.LOGIN,
            payload: {
              user
            }
          });
          router.push(returnTo || paths.index);
        }
      } else {
        setError(error)
      }
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong')
    }
  }, [dispatch]);
  
  
  const logout = useCallback(() => {
    setError(false);
    document.cookie = `__token=;domain=${domain};expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    dispatch({type: ActionType.LOGOUT});
    router.push(paths.login);
  }, [dispatch])
  
  const register = useCallback(async (values) => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.auth.register(values);
      const {result, error} = await res.json();
      setLoading(false);
      if (result && !error) {
        dispatch({type: ActionType.REGISTER});
        return true
      } else {
        setError(error)
      }
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong')
    }
  }, [dispatch]);
  
  const restore = useCallback(async (values) => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.auth.restore(values);
      const {result, error} = await res.json();
      setLoading(false);
      if (result && !error) {
        return true
      } else {
        setError(error)
      }
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong')
    }
    
  }, [dispatch]);
  
  const password = useCallback(async (values) => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.auth.password(values);
      const {result, error} = await res.json();
      setLoading(false);
      if (result && !error) {
        return true
      } else {
        setError(error)
      }
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong')
    }
    
    
  }, [dispatch]);
  
  
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        login2fa,
        logout,
        register,
        restore,
        password,
        error,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
