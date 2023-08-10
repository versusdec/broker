import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {ticketsGet} from "../slices/ticketsSlice";

export const useTicket = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.tickets.get)
  
  const getTicket = useCallback((params) => {
      dispatch(ticketsGet(params))
  }, [dispatch])
  
  useEffect(() => {
    getTicket(params)
  }, [params, getTicket])
  
  return {data, loading, error}
}