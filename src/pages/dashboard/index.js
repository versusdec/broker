import {
  Box,
  Card,
  CardContent,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Typography,
  Unstable_Grid2 as Grid, SvgIcon, Tooltip
} from '@mui/material';
import {Button} from "../../components/button";
import NextLink from "next/link";
import {paths} from "../../navigation/paths";
import {useProjects} from "../../hooks/useProjects";
import {useCallback, useEffect, useState} from "react";
import {format} from "date-fns";
import {HelpOutline} from "@mui/icons-material";

const Page = () => {
  const [projects, setProjects] = useState(null)
  
  const projectsData = useProjects(useCallback(() => ({
    status: 'active',
    limit: '10'
  }), []))
  
  useEffect(() => {
    if (projectsData.data?.items) setProjects(projectsData.data.items)
  }, [projectsData])
  
  console.log(projects)
  
  return (
    <>
      <Box>
        <Typography variant="h4" sx={{mb: 4}}>
          Overview
        </Typography>
        
        <Grid container spacing={{
          xs: 3, lg: 4
        }}>
          <Grid xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} spacing={2}>
                    <Typography variant={'h6'}>
                      Projects
                    </Typography>
                    <Button variant={'text'} component={NextLink} href={paths.projects.index}>See All Projects</Button>
                  </Stack>
                </Stack>
              </CardContent>
              <Box mb={5}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Project Title</TableCell>
                      <TableCell>Creation Date</TableCell>
                      <TableCell/>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects && projects.map((p, i) => {
                      
                      return <TableRow key={i}>
                        <TableCell>{p.id}</TableCell>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{format(p.created * 1000, 'dd/MM/yyyy hh:mm')}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Card>
          </Grid>
          <Grid xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h6">Your Balance</Typography>
                  <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <Box>ICON</Box>
                    <Box>
                      <Typography variant={'h6'}>$ 0,00</Typography>
                      <Stack color={'neutral.500'} direction={'row'} spacing={1}>
                        <Box>Your tariff:</Box>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                          <Box color={'primary.main'} fontWeight={500}>Basic</Box>
                          <SvgIcon fontSize={'10px'} color={'primary'}><HelpOutline/></SvgIcon>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
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
