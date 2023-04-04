import {
  Box,
  Paper,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

const Page = () => {

  
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
