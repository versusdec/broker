import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {paymentsList} from "../slices/paymentsSlice";
import {wait} from "../utils/wait";

export const usePayments = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.payments.list)
  
  const getPayments = useCallback(() => {
      dispatch(paymentsList(params))
  }, [params, dispatch])
  
  const update = useCallback(()=>{
    getPayments()
  }, [getPayments])
  
  useEffect(() => {
    getPayments()
  }, [params, getPayments])
  
  return {data, loading, error, update}
}