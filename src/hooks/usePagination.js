import {useRouter} from "next/router";
import {useParams} from "../utils/use-params";
import {useCallback, useState} from "react";

export const usePagination = () => {
  const [state, setState] = useState({
    page: 1,
    limit: 10,
    offset: 0
  });
  
  const handlePageChange = useCallback((event, page) => {
    setState(state => ({
      ...state,
      page: (page + 1),
      offset: page * state.limit
    }))
  }, [])
  
  const handleLimitChange = useCallback((event) => {
    setState(state => ({
      ...state,
      page: 1,
      limit: parseInt(event.target.value, 10),
      offset: 0
      // offset: (state.page - 1) * parseInt(event.target.value, 10)
    }))
  }, [])
  
  return {
    ...state,
    handlePageChange,
    handleLimitChange
  }
}
