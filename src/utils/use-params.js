import {useSearchParams} from "next/navigation";

export const useParams = (param) => {
  const searchParams = useSearchParams();

  return searchParams.get(param) || undefined
};