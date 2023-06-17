import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {transactionsList} from "../slices/transactionsSlice";

export const useTransactions = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.transactions.list)
  
  const getTransactions = useCallback(() => {
      dispatch(transactionsList(params))
  }, [params])
  
  const update = useCallback(()=>{
    getTransactions()
  }, [params])
  
  useEffect(() => {
    getTransactions()
  }, [params])
  
  return {data, loading, error, update}
}