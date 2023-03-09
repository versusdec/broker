import {useRouter} from "next/router";
import {useParams} from "../utils/use-params";

export const usePagination = () => {
  const router = useRouter();
  let p = +useParams('page') || 1;
  let l = +useParams('limit') || 1;
  const o = (p - 1) * l;
  
  const handlePageChange = (event, page) => {
    p = page++;
    router.push(`?page=${page}&limit=${l}`);
  }
  
  const handleLimitChange = (event) => {
    l = parseInt(event.target.value, 10);
    router.push(`?page=${p}&limit=${l}`);
  }
  
  return {
    page: p,
    limit: l,
    offset: o,
    handlePageChange,
    handleLimitChange
  }
}
