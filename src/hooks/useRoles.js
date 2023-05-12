import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {rolesList, rolesSuggest} from "../slices/rolesSlice";

export const useRoles = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.roles.list)
  
  const getRoles = useCallback(() => {
    if (params.q)
      dispatch(rolesSuggest(params))
    else
      dispatch(rolesList(params))
  }, [params])
  
  useEffect(() => {
    getRoles()
  }, [params])
  
  return {data, loading, error}
}