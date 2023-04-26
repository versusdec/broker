import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {paymentsList} from "../slices/paymentsSlice";
import {wait} from "../utils/wait";

export const usePayments = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.payments.list)
  
  const getPayments = useCallback(() => {
      dispatch(paymentsList(params))
  }, [params])
  
  const update = useCallback(()=>{
    getPayments()
  }, [params])
  
  useEffect(() => {
    getPayments()
  }, [params])
  
  return {data, loading, error, update}
}