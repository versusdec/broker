import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {ticketsList} from "../slices/ticketsSlice";

export const useTickets = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.tickets.list)
  
  const getTicketsList = useCallback((params) => {
      dispatch(ticketsList(params))
  }, [dispatch])
  
  useEffect(() => {
    getTicketsList(params)
  }, [params, getTicketsList])
  
  return {data, loading, error}
}