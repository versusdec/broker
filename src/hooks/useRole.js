import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {rolesGet} from "../slices/rolesSlice";

export const useRole = (id) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.roles.get)
  
  const get = useCallback(() => {
    if (!!id) {
      dispatch(rolesGet(id))
    }
  }, [id])
  
  useEffect(() => {
    get()
  }, [dispatch, id])
  
  return {data, loading, error}
}
