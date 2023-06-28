import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {fieldsList, fieldsSuggest} from "../slices/fieldsSlice";

export const useFields = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.fields.list)
  
  const getFieldsList = useCallback((params) => {
    if (params.q)
      dispatch(fieldsSuggest(params))
    else
      dispatch(fieldsList(params))
  }, [dispatch])
  
  useEffect(() => {
    getFieldsList(params)
  }, [dispatch, params, getFieldsList])
  
  return {data, loading, error}
}