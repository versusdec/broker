import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import Head from "../components/head";

export const Layout = (props) => {
  const {children} = props;
  const title = props.title
    ? props.title
    : props.children?.props.title
      ? props.children.props.title
      : false
  
  return (
    <>
      <Head title={title} />
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: {
            xs: 'column-reverse',
            md: 'row'
          }
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: '#222223',
            backgroundImage: 'url("/assets/auth_bg.svg")',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            color: 'common.white',
            display: 'flex',
            flex: {
              xs: '0 0 auto',
              md: '1 1 auto'
            },
            justifyContent: 'center',
            p: {
              xs: 4,
              md: 8
            }
          }}
        >
          <img src="/assets/logo.svg" alt="" style={{maxWidth: '600px'}} />
        </Box>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flex: {
              xs: '1 1 auto',
              md: '0 0 auto'
            },
            flexDirection: 'column',
            justifyContent: {
              md: 'center'
            },
            maxWidth: '100%',
            p: {
              xs: 4,
              md: 8
            },
            width: { 
              md: 500
            }
          }}
        >
          <div>
            {children}
          </div>
        </Box>
      </Box>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};
