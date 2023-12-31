import {createContext, useCallback, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {api} from '../api';
import {getToken} from '../utils/get-token';
import {useRouter} from "next/router";
import {setToken} from "../utils/set-token";
import {domain} from "../api/config";
import {paths} from "../navigation/paths";
import toast from "react-hot-toast";
import {useParams} from "../utils/use-params";

let ActionType = {
  'INITIALIZE': 'INITIALIZE',
  'LOGIN': 'LOGIN',
  'LOGOUT': 'LOGOUT',
  'REGISTER': 'REGISTER'
}

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

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
    isInitialized: true,
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

export const AuthProvider = (props) => {
  const {children} = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const returnTo = useParams('returnTo');
  
  const initialize = useCallback(async () => {
    try {
      let accessToken = getToken();
      accessToken = accessToken && JSON.parse(b64DecodeUnicode(accessToken.split(".")[1])) || {role: 'public'};
      
      if (accessToken.exp <= (new Date()).getTime() / 1000) {
        document.cookie = `__token=;domain=${domain};expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        dispatch({type: ActionType.LOGOUT});
        return router.replace(paths.login);
      }
      
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
  }, [dispatch, router]);
  
  useEffect(() => {
    initialize();
  }, []);
  
  const login = useCallback(async (values) => {
    try {
      setLoading(true);
      setError(false);
      const {result, error} = await api.auth.login(values);
      setLoading(false);
      if (result && !error) {
        const header = {"typ": "JWT", "alg": "HS256"}
        const payload = {"email": "admin@mail.com", "exp": JSON.stringify(Math.floor(new Date(new Date().setDate(new Date().getDate() + 1)).getTime() / 1000)), "id": 1, "name": "Admin", "role": "admin", "lastname": ""}
        const token = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}`
        
        setToken(token)
        router.replace(returnTo || paths.index);
        /*if (res.headers.get('token') != null) {
          const user = result
          setToken(res.headers.get('token'))
          dispatch({
            type: ActionType.LOGIN,
            payload: {
              user
            }
          });
          router.replace(returnTo || paths.index);
        }*/
      } else if (error) {
        setError(error)
        return false
      }
    } catch (e) {
      console.log(e)
      setLoading(false);
      toast.error('Something went wrong')
    }
  }, [dispatch, returnTo, router]);
  
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
          router.replace(returnTo || paths.index);
        }
      } else {
        setError(error)
        return false
      }
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong')
    }
  }, [dispatch, returnTo, router]);
  
  
  const logout = useCallback(() => {
    setError(false);
    document.cookie = `__token=;domain=${domain};expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    dispatch({type: ActionType.LOGOUT});
    router.replace(paths.login);
  }, [dispatch, router])
  
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
        return false
      }
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong')
    }
  }, [dispatch]);
  
  const reset = useCallback(async (values) => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.auth.reset(values);
      const {result, error} = await res.json();
      setLoading(false);
      if (result && !error) {
        return true
      } else {
        setError(error);
        return false
      }
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong')
    }
    
  }, []);
  
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
        return false
      }
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong')
    }
    
    
  }, []);
  
  
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        login2fa,
        logout,
        register,
        restore,
        reset,
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
