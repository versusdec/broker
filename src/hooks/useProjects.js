import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {projectsList, projectsSuggest} from "../slices/projectsSlice";
import {usersList, usersSuggest} from "../slices/usersSlice";

export const useProjects = (params) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.projects.list)
  
  const getProjectsList = useCallback((params) => {
    if (params.q)
      dispatch(projectsSuggest(params))
    else
      dispatch(projectsList(params))
  }, [params])
  
  useEffect(() => {
    getProjectsList(params)
  }, [dispatch, params])
  
  return {projects: data, loading, error}
}