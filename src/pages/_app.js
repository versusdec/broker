import Head from 'next/head';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {Provider as ReduxProvider} from 'react-redux';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {Layout as DashboardLayout} from '../layouts/dashboard';
import {createTheme} from '../theme';
import {Toaster} from '../components/toaster';
import {store} from '../store'

// Remove if nprogress is not used
import '../locales/i18n';
import {AuthProvider, AuthConsumer} from "../contexts/authContext";
import {SplashAnimation} from "../components/splash-animation";

const getDefaultLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
)

const App = ({Component, pageProps}) => {
  const getLayout = Component.getLayout ?? getDefaultLayout;
  
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
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            
            <AuthProvider>
              <AuthConsumer>
                {(auth) => {
                  const showSlashScreen = !auth.isInitialized;
                  
                  return (
                    <>
                      <Head>
                        <meta
                          name="color-scheme"
                          content={'light'}
                        />
                        <meta
                          name="theme-color"
                          content={theme.palette.neutral[900]}
                        />
                      </Head>
                      <>
                        <CssBaseline/>
                        
                        {showSlashScreen
                          ? <SplashAnimation /> :
                          getLayout(
                            <Component {...pageProps} />
                        )}
                        <Toaster/>
                      </>
                    </>
                  )
                }}
              </AuthConsumer>
            </AuthProvider>
          
          </ThemeProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </>
  );
};

export default App;
