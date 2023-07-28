import {
  Box,
  Typography,
  Unstable_Grid2 as Grid, Paper
} from '@mui/material';
import {useCallback, useEffect, useState} from "react";
import {useProjects} from "../../hooks/useProjects";
import NextLink from "next/link";
import {Button} from "../../components/button";

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
              <Button component={NextLink} href={'/verto-test'}>Verto</Button>
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
