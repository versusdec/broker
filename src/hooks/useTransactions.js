import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {transactionsList} from "../slices/transactionsSlice";

export const useTransactions = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.transactions.list)
  
  const getTransactions = useCallback(() => {
      dispatch(transactionsList(params))
  }, [params, dispatch])
  
  const update = useCallback(()=>{
    getTransactions()
  }, [getTransactions])
  
  useEffect(() => {
    getTransactions()
  }, [params, getTransactions])
  
  return {data, loading, error, update}
}