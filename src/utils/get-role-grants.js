import {useCallback, useEffect, useState} from "react";
import {api} from "../api";

export const getGrants = (id) => {
  const [grants, setGrants] = useState([]);
  
  const getRole = useCallback(async (id) => {
    const {result} = await api.roles.get(id);
    if (result) setGrants(result.grants)
  }, [id])
  
  useEffect(() => {
    if (id) getRole(id)
  }, [id])
  
  return grants;
}