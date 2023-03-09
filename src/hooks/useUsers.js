import {useDispatch, useSelector} from "../store";
import {useEffect} from "react";
import {usersList, usersSuggest} from "../slices/usersSlice";

export const useUsers = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.users.list)
  
  useEffect(() => {
    if (params.q) {
      dispatch(usersSuggest(params))
    } else
      dispatch(usersList(params))
  }, [dispatch, params])
  
  return {users: data, loading, error}
}