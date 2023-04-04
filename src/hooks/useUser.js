import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {usersGet} from "../slices/usersSlice";
import {actions} from "../slices/usersSlice";

export const useUser = (id) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.users.get)
  
  const getUser = useCallback(() => {
    if (!!id) {
      dispatch(usersGet(id))
    } /*else {
      dispatch(actions.fillUser({
        "name": "",
        "email": "",
        "avatar": "",
        "timezone": 180,
        "language": "en",
        "password": "",
        "company": "",
        "status": "active",
        "queues": [],
        "role": "client"
      }))
    }*/
  }, [id])
  
  useEffect(() => {
    getUser()
  }, [dispatch, id])
  
  return {user: data, loading, error}
}
