import {useDispatch} from "../store";
import {api} from "../api";
import {useEffect, useState} from "react";
import {domain} from '../api/config'
import {useRouter} from 'next/router'
import {paths} from "../navigation/paths";

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

export const setToken = (token)=>{
  let t = token && JSON.parse(b64DecodeUnicode(token.split(".")[1])) || {role: 'public'};
  document.cookie = `__token=${token};domain=${domain};expires=${t.exp}; path=/`
}

export const useAuth = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {router} = useRouter();
  
  const login = async (values) => {
    setLoading(true);
    setSuccess(false);
    setError(false);
    const res = await api.auth.login(values);
    const response = await res.json();
    setLoading(false);
    if (response.result && !response.result.error) {
      setSuccess(true)
      if (res.headers.get('token') != null) {
        setToken(res.headers.get('token'))
      }
    } else if(response.result.error){
      setSuccess(false)
      setError(response.result.error)
    }
    else if (response.error) {
      console.table(response.error)
      setSuccess(false)
    }
  }
  
  const logout = ()=>{
    document.cookie = `__token=;domain=${domain};expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    router.push(paths.index)
  }
  
  return {
    login,
    logout,
    success,
    error,
    loading
  }
}