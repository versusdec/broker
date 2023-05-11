import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {queuesList} from "../slices/queuesSlice";

export const useQueues = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.queues.list)
  
  const getQueues = useCallback(() => {
      dispatch(queuesList(params))
  }, [params])
  
  const update = useCallback(()=>{
    getQueues()
  }, [params])
  
  useEffect(() => {
    getQueues()
  }, [params])
  
  return {data, loading, error, update}
}