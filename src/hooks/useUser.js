import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {usersGet} from "../slices/usersSlice";

export const useUser = (id) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.users.get)
  
  const getUser = useCallback(() => {
    if (!!id) {
      dispatch(usersGet(id))
    }
  }, [id, dispatch])
  
  useEffect(() => {
    getUser()
  }, [id, getUser])
  
  return {data, loading, error}
}
