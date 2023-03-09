import {useDispatch, useSelector} from "../store";
import {useEffect} from "react";
import {usersMe} from "../slices/usersSlice";

export const useMe = () => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.users.me)

  useEffect(() => {
    if (!data)
      dispatch(usersMe())
  }, [data, dispatch])
  
  return {user: data, loading, error}
}