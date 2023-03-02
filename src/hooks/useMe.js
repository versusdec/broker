import {useDispatch, useSelector} from "../store";
import {api} from "../api";
import {useEffect, useState} from "react";
import {domain} from '../api/config'
import {useRouter} from 'next/router'
import {paths} from "../navigation/paths"
import {usersMe} from "../slices/usersSlice";

export const useMe = () => {
  const dispatch = useDispatch();
  const me = useSelector(state => state.users.me)

  useEffect(() => {
      if(!me)
        dispatch(usersMe())
  }, [me, dispatch])
  
  return me
}