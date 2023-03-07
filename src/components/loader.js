import {Box, CircularProgress} from "@mui/material";

export const Loader = () => {
  const loader = (
    <Box
      data-testid={'loader'}
      sx={{
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        bgcolor: 'rgb(0 0 1 / 30%)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress disableShrink color={'primary'} />
    </Box>
  )
  
  return <>{loader}</>
}
