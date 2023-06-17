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
  }, [params])
  
  const update = useCallback(()=>{
    getQueues()
  }, [params])
  
  useEffect(() => {
    getQueues()
  }, [params])
  
  return {data, loading, error, update}
}