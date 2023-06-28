import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {projectsList, projectsSuggest} from "../slices/projectsSlice";

export const useProjects = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.projects.list)
  
  const getProjectsList = useCallback((params) => {
    if (params.q)
      dispatch(projectsSuggest(params))
    else
      dispatch(projectsList(params))
  }, [dispatch])
  
  useEffect(() => {
    getProjectsList(params)
  }, [params, getProjectsList])
  
  return {projects: data, loading, error}
}