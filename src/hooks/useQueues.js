import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {queuesList, queuesSuggest} from "../slices/queuesSlice";

export const useQueues = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.queues.list)
  
  const getQueues = useCallback(() => {
    if (params.q)
      dispatch(queuesSuggest(params))
    else
      dispatch(queuesList(params))
  }, [params, dispatch])
  
  const update = useCallback(()=>{
    getQueues()
  }, [getQueues])
  
  useEffect(() => {
    getQueues()
  }, [params, getQueues])
  
  return {data, loading, error, update}
}