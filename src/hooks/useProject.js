import {useDispatch, useSelector} from "../store";
import {useCallback, useEffect} from "react";
import {projectsGet} from "../slices/projectsSlice";
import {actions} from "../slices/projectsSlice";

export const useProject = (id) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.projects.get)
  
  const getProject = useCallback(() => {
    if (!!id) {
      dispatch(projectsGet(id))
    }
  }, [id])
  
  useEffect(() => {
    getProject()
  }, [dispatch, id])
  
  return {project: data, loading, error}
}
