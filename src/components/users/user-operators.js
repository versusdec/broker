import {Button, Card, CardContent, Checkbox, Stack, TextField, Autocomplete} from "@mui/material";
import {CheckBox, CheckBoxOutlineBlank} from '@mui/icons-material'
import {useMemo, useState} from "react";
import {usePagination} from "../../hooks/usePagination";
import {useUsers} from "../../hooks/useUsers";

export const OperatorsTab = ({...props}) => {
  const [disabled, setDisabled] = useState(false);
  const {page, limit, offset, handlePageChange, handleLimitChange} = usePagination();
  
  const params = useMemo(() => {
    return {
      limit: limit, offset: offset
    }
  }, [limit, page, offset]);
  
  const {data, loading} = useUsers(params);
  const {items, total} = data || {items: [], limit: limit, total: 0};
  
  
  return (<>
  
  </>)
}