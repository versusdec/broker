import {useTheme} from '@mui/material/styles';

export const Logo = (props) => {
    const theme = useTheme();
    const fillColor = theme.palette.primary.main;

    return (
      <img src={`/assets/koala-call-text-theme-${theme.palette.mode}.png`} alt="" {...props} />
    );
};
