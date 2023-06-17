import {TablePagination} from "@mui/material";

export const Pagination = ({limit, total, page, onPageChange, onLimitChange, ...rest}) => {
  
  return (
    <TablePagination
      component="div"
      count={total}
      onPageChange={onPageChange}
      onRowsPerPageChange={onLimitChange}
      page={page - 1}
      rowsPerPage={limit}
      rowsPerPageOptions={[10, 25, 50]}
    />
  )
}