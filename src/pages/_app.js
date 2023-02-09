import Head from 'next/head';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {SplashScreen} from '../components/splash-screen';
import {createTheme} from '../theme';
// Remove if nprogress is not used
import '../locales/i18n';

const App = ({Component, pageProps}) => {
    const getLayout = Component.getLayout ?? ((page) => page);

    const theme = createTheme({
        colorPreset: 'indigo',
        contrast: 'normal',
        direction: 'ltr',
        layout: 'vertical',
        navColor: 'evident',
        paletteMode: 'light',
        responsiveFontSizes: true,
        stretch: true
    });

    return (
        <>
            <Head>
                <title>
                    KOALACALL LLC
                </title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    {getLayout(
                        <Component {...pageProps} />
                    )}
                </ThemeProvider>
            </LocalizationProvider>
        </>
    );
};

export default App;
