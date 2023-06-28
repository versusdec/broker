import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {scriptsGet} from "../slices/scriptsSlice";

export const useScript = (id) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.scripts.get)
  
  const getScript = useCallback(() => {
    if (!!id) {
      dispatch(scriptsGet(id))
    }
  }, [id, dispatch])
  
  useEffect(() => {
    getScript()
  }, [getScript, id])
  
  return {data, loading, error}
}
