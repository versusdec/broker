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
                        <TableCell/>
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
                    <Box>
                      <svg width="72" height="74" viewBox="0 0 72 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.5" filter="url(#filter0_f_305_33074)">
                          <rect x="21.1191" y="42.1212" width="20.3636" height="19.7143" rx="5" transform="rotate(-90 21.1191 42.1212)" fill="#8237FF" fill-opacity="0.5"/>
                        </g>
                        <g filter="url(#filter1_b_305_33074)">
                          <path d="M32.1054 22.7273L48.3911 22.7273L59.8718 33.6612L59.8718 53.1464C59.8718 58.0103 55.4634 61.9525 50.0241 61.9525H32.566C26.8635 61.9525 22.2139 57.8142 22.2139 52.7149L22.2139 31.5726C22.2139 26.7087 26.6442 22.7273 32.1054 22.7273Z" fill="#BA90FF"
                                fill-opacity="0.35"/>
                          <path d="M32.1054 23.2273L48.1911 23.2273L59.3718 33.8754L59.3718 53.1464C59.3718 57.6831 55.2413 61.4525 50.0241 61.4525H32.566C27.0842 61.4525 22.7139 57.4857 22.7139 52.7149L22.7139 31.5726C22.7139 27.0352 26.8671 23.2273 32.1054 23.2273Z"
                                stroke="url(#paint0_linear_305_33074)" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        <path
                          d="M23.8476 14C18.4084 14 14 17.9421 14 22.806L14 43.9884C14 48.4389 17.5418 52.1573 22.2341 53.0315C22.2334 52.9869 22.233 52.9423 22.233 52.8977V31.7553C22.233 26.8914 26.6633 22.91 32.1245 22.91H48.4103L51.6579 26.003V23.2375C51.6579 18.1383 47.0082 14 41.3058 14L23.8476 14Z"
                          fill="url(#paint1_linear_305_33074)"/>
                        <g opacity="0.5" filter="url(#filter2_f_305_33074)">
                          <path d="M51.6388 25.8203L51.6388 44.2371C51.6388 49.101 47.2304 53.0431 41.7911 53.0431H24.333C23.6074 53.0431 22.899 52.9762 22.2149 52.8487C22.2142 52.8042 22.2139 52.7596 22.2139 52.7149V31.5726C22.2139 26.7087 26.6442 22.7273 32.1054 22.7273H48.3911L51.6388 25.8203Z"
                                fill="url(#paint2_linear_305_33074)"/>
                        </g>
                        <path
                          d="M33.7283 38.4424H41.1961C42.0165 38.4424 42.6532 39.0367 42.6532 39.6993C42.6532 40.3586 42.0202 40.9367 41.1961 40.9367H33.7283C32.9043 40.9367 32.2713 40.3586 32.2713 39.6993C32.2713 39.0367 32.908 38.4424 33.7283 38.4424ZM45.7476 50.6485H33.7284C32.908 50.6485 32.2713 50.0542 32.2713 49.3916C32.2713 48.7323 32.9043 48.1542 33.7284 48.1542H45.7476C46.5716 48.1542 47.2046 48.7323 47.2046 49.3916C47.2046 50.0542 46.5679 50.6485 45.7476 50.6485Z"
                          fill="url(#paint3_linear_305_33074)" stroke="url(#paint4_linear_305_33074)" stroke-width="0.4"/>
                        <g filter="url(#filter3_d_305_33074)">
                          <mask id="path-7-inside-1_305_33074" fill="white">
                            <path
                              d="M50.1953 34.8331C51.7273 34.8463 53.8573 34.8519 55.6641 34.8463C56.5895 34.8444 57.0599 33.8959 56.4181 33.3246C54.0969 31.2542 49.9447 27.5489 47.5685 25.4295C46.9113 24.8431 45.7617 25.2466 45.7617 26.0593V31.0298C45.7617 33.1153 47.7642 34.8331 50.1953 34.8331Z"/>
                          </mask>
                          <path
                            d="M50.1953 34.8331C51.7273 34.8463 53.8573 34.8519 55.6641 34.8463C56.5895 34.8444 57.0599 33.8959 56.4181 33.3246C54.0969 31.2542 49.9447 27.5489 47.5685 25.4295C46.9113 24.8431 45.7617 25.2466 45.7617 26.0593V31.0298C45.7617 33.1153 47.7642 34.8331 50.1953 34.8331Z"
                            fill="url(#paint5_linear_305_33074)"/>
                          <path
                            d="M55.6641 34.8463L55.6633 34.4463L55.6629 34.4463L55.6641 34.8463ZM56.4181 33.3246L56.1518 33.6231L56.1521 33.6234L56.4181 33.3246ZM47.5685 25.4295L47.3022 25.728L47.3023 25.728L47.5685 25.4295ZM50.1918 35.2331C51.7256 35.2463 53.8571 35.2519 55.6654 35.2463L55.6629 34.4463C53.8575 34.4519 51.7291 34.4463 50.1987 34.4331L50.1918 35.2331ZM55.6649 35.2463C56.2681 35.245 56.7619 34.9312 56.9872 34.4766C57.2183 34.0103 57.1428 33.4342 56.684 33.0258L56.1521 33.6234C56.3351 33.7863 56.3454 33.9701 56.2704 34.1213C56.1896 34.2843 55.9856 34.4456 55.6633 34.4463L55.6649 35.2463ZM56.6843 33.0261C54.36 30.9529 50.2142 27.2533 47.8348 25.131L47.3023 25.728C49.6752 27.8446 53.8337 31.5555 56.1518 33.6231L56.6843 33.0261ZM47.8349 25.1311C47.3808 24.7259 46.7706 24.673 46.2867 24.8421C45.804 25.0109 45.3617 25.4377 45.3617 26.0593H46.1617C46.1617 25.8682 46.2943 25.6869 46.5507 25.5973C46.8058 25.5082 47.0991 25.5467 47.3022 25.728L47.8349 25.1311ZM45.3617 26.0593V31.0298H46.1617V26.0593H45.3617ZM45.3617 31.0298C45.3617 33.3915 47.603 35.2331 50.1953 35.2331V34.4331C47.9254 34.4331 46.1617 32.839 46.1617 31.0298H45.3617Z"
                            fill="url(#paint6_linear_305_33074)" mask="url(#path-7-inside-1_305_33074)"/>
                        </g>
                        <defs>
                          <filter id="filter0_f_305_33074" x="0.119141" y="0.757568" width="61.7139" height="62.3636" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feGaussianBlur stdDeviation="10.5" result="effect1_foregroundBlur_305_33074"/>
                          </filter>
                          <filter id="filter1_b_305_33074" x="-1.78613" y="-1.27271" width="85.6582" height="87.2252" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feGaussianBlur in="BackgroundImageFix" stdDeviation="12"/>
                            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_305_33074"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_305_33074" result="shape"/>
                          </filter>
                          <filter id="filter2_f_305_33074" x="2.21387" y="2.72729" width="69.4248" height="70.3159" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_305_33074"/>
                          </filter>
                          <filter id="filter3_d_305_33074" x="40.7617" y="20.1515" width="30.9521" height="29.697" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dx="5" dy="5"/>
                            <feGaussianBlur stdDeviation="5"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0.577356 0 0 0 0 0.359375 0 0 0 0 0.9375 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_305_33074"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_305_33074" result="shape"/>
                          </filter>
                          <linearGradient id="paint0_linear_305_33074" x1="28.2084" y1="27.2971" x2="53.4256" y2="57.2814" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white" stopOpacity="0.25"/>
                            <stop offset="1" stopColor="white" stopOpacity="0"/>
                          </linearGradient>
                          <linearGradient id="paint1_linear_305_33074" x1="41.0292" y1="14" x2="41.0292" y2="53.2259" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#BC94FF"/>
                            <stop offset="1" stopColor="#9F66FF"/>
                          </linearGradient>
                          <linearGradient id="paint2_linear_305_33074" x1="43.3338" y1="22.7273" x2="43.3338" y2="53.1942" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#BC94FF"/>
                            <stop offset="1" stopColor="#9F66FF"/>
                          </linearGradient>
                          <linearGradient id="paint3_linear_305_33074" x1="46.3175" y1="40.5188" x2="29.2463" y2="41.1958" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white"/>
                            <stop offset="1" stopColor="white" stopOpacity="0.2"/>
                          </linearGradient>
                          <linearGradient id="paint4_linear_305_33074" x1="34.5121" y1="39.7111" x2="42.0927" y2="51.1311" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white" stopOpacity="0.25"/>
                            <stop offset="1" stopColor="white" stopOpacity="0"/>
                          </linearGradient>
                          <linearGradient id="paint5_linear_305_33074" x1="55.9376" y1="26.9026" x2="43.7412" y2="27.3517" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white"/>
                            <stop offset="1" stopColor="white" stopOpacity="0.2"/>
                          </linearGradient>
                          <linearGradient id="paint6_linear_305_33074" x1="47.5052" y1="26.2812" x2="53.4924" y2="34.6566" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white" stopOpacity="0.25"/>
                            <stop offset="1" stopColor="white" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </Box>
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
