import {
  Box,
  Typography,
  Unstable_Grid2 as Grid, Paper
} from '@mui/material';
import {useCallback, useEffect, useState} from "react";
import {useProjects} from "../../hooks/useProjects";

const Page = () => {
  const [projects, setProjects] = useState(null)
  
  const projectsData = useProjects(useCallback(() => ({
    status: 'active',
    limit: '10'
  }), []))
  
  useEffect(() => {
    if (projectsData.data?.items) setProjects(projectsData.data.items)
  }, [projectsData])
  
  return (
    <>
      <Box>
        <Typography variant="h4" sx={{mb: 4}}>
          Overview
        </Typography>
        <Grid
          container
          disableEqualOverflow
          spacing={{
            xs: 3,
            lg: 4
          }}
        >
          <Grid xs={12}>
            <Paper sx={{p: 2}}>
              HELLO WORLD
            </Paper>
          </Grid>
        </Grid>
      
      </Box>
    </>
  );
};

Page.defaultProps = {
  title: 'Dashboard',
}

export default Page;
