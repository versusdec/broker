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
  }, [id])
  
  useEffect(() => {
    getQueue()
  }, [dispatch, id])
  
  return {data, loading, error}
}
