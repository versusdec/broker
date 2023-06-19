import {useTheme} from '@mui/material/styles';

export const Logo = (props) => {
    const theme = useTheme();

    return (
      <img width={600} src={`/assets/koala-call-text-theme-${theme.palette.mode}.png`} alt="" {...props} />
    );
};
