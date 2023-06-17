import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {usersList, usersSuggest} from "../slices/usersSlice";

export const useUsers = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.users.list)
  
  const getUsers = useCallback(() => {
    if (params.q)
      dispatch(usersSuggest(params))
    else
      dispatch(usersList(params))
  }, [params])
  
  useEffect(() => {
    getUsers()
  }, [params])
  
  return {users: data, loading, error}
}