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
  }, [params])
  
  const update = useCallback(()=>{
    getScripts()
  }, [params])
  
  useEffect(() => {
    getScripts()
  }, [params])
  
  return {data, loading, error, update}
}