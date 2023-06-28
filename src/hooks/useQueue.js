import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {queuesGet} from "../slices/queuesSlice";

export const useQueue = (id) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.queues.get)
  
  const getQueue = useCallback(() => {
    if (!!id) {
      dispatch(queuesGet(id))
    }
  }, [id, dispatch])
  
  useEffect(() => {
    getQueue()
  }, [dispatch, id, getQueue])
  
  return {data, loading, error}
}
