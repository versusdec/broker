import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect, useState} from "react";
import {projectsList, projectsSuggest} from "../slices/projectsSlice";

export const useProjects = (params) => {
  const [id, setId] = useState(null)
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.projects.list)
  
  const getProjectsList = useCallback((params) => {
    if (params) {
      if (params.q)
        dispatch(projectsSuggest(params))
      else
        dispatch(projectsList(params))
    }
  }, [dispatch])
  
  const getProjectId = useCallback(() => {
    const id = localStorage.getItem('project_id')
    setId(id)
  }, [])
  
  const setProjectId = useCallback((id) => {
    localStorage.setItem('project_id', id)
    setId(id);
  }, [])
  
  useEffect(() => {
    getProjectId()
  }, [])
  
  useEffect(() => {
    getProjectsList(params)
  }, [params, getProjectsList])
  
  return {data, loading, error, id, setProjectId}
}