import {useDispatch, useSelector} from "../store";
import {useEffect} from "react";
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