import {
  Box,
  Paper,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import {useRouter} from 'next/router'
import {Button} from "../../components/button";
import NextLink from "next/link";

const Page = () => {
 const router = useRouter();
  // router.replace('/projects')
  
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
              <Box>HELLO WORLD</Box>
              <br/>
              <Button component={NextLink} href={'/verto-test'}>VERTO</Button>
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
