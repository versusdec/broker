import {Box} from "@mui/material";
import {useTheme} from "@mui/material/styles";
// import video from './koala-anim.mp4'
//todo add video importer for webpack like https://github.com/jeremybarbet/next-videos etc

export const SplashAnimation = (props) => {
  const theme = useTheme();
  const fillColor = theme.palette.primary.dark;
  
  const defaultProps = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    background: 'black'
  }
  
  return (
    <Box sx={{...defaultProps}}>
      <img src="/assets/logo.svg" style={{height: '100%', width: '100%', objectFit: 'cover'}} alt=""/>
      {/*<video style={{height: '100%', width: '100%', objectFit: 'cover'}} autoPlay preload {...props}>
        <source src={video} type={"video/mp4"}/>
      </video>*/}
    </Box>
  );
};
