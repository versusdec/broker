import {useCallback, useEffect, useState} from "react";
import {api} from "../api";

export const useGrants = (id) => {
  const [grants, setGrants] = useState([]);

  const getRole = useCallback(async () => {
    const {result} = await api.roles.get(id);
    if (result) setGrants(result.grants)
  }, [id])

  useEffect(() => {
    if (id) getRole()
  }, [id])

  return grants;
}
