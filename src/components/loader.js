import {Box, CircularProgress} from "@mui/material";

export const Loader = ({backdrop, sx, ...props}) => {
  const loader = (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        bgcolor: backdrop ? 'rgb(0 0 1 / 30%)' : 'transparent',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...sx
      }}
    >
      <CircularProgress disableShrink color={'primary'} />
    </Box>
  )
  
  return <>{loader}</>
}
