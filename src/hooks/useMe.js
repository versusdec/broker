import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {usersMe} from "../slices/usersSlice";

export const useMe = () => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.users.me)

  const fetch = useCallback(()=>{
    dispatch(usersMe())
  }, [dispatch])
  
  useEffect(() => {
    fetch()
  }, [])
  
  return {data, loading, error}
}