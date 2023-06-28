import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {scriptsList, scriptsSuggest} from "../slices/scriptsSlice";

export const useScripts = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.scripts.list)
  
  const getScripts = useCallback(() => {
    if (params.q)
      dispatch(scriptsSuggest(params))
    else
      dispatch(scriptsList(params))
  }, [params, dispatch])
  
  const update = useCallback(()=>{
    getScripts()
  }, [getScripts])
  
  useEffect(() => {
    getScripts()
  }, [params, getScripts])
  
  return {data, loading, error, update}
}