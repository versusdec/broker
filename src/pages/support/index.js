import {useCallback, useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import {useSearchParams} from 'next/navigation';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import {Box, Divider, IconButton, SvgIcon, Typography, useMediaQuery} from '@mui/material';
import {ChatBlank} from '../../components/chat/chat-blank';
import {ChatComposer} from '../../components/chat/chat-composer';
import {ChatContainer} from '../../components/chat/chat-container';
import {ChatSidebar} from '../../components/chat/chat-sidebar';
import {ChatThread} from '../../components/chat/chat-thread';
import {useDispatch} from '../../store';

/**
 * NOTE:
 * In our case there two possible routes
 * one that contains /chat and one with a chat?threadKey={{threadKey}}
 * if threadKey does not exist, it means that the chat is in compose mode
 */

const useParams = () => {
  const searchParams = useSearchParams();
  const compose = searchParams.get('compose') === 'true';
  const threadKey = searchParams.get('threadKey') || undefined;
  
  return {
    compose,
    threadKey
  };
};

const useSidebar = () => {
  const searchParams = useSearchParams();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [isOpen, setIsOpen] = useState(mdUp);
  
  const handleScreenResize = useCallback(() => {
    if (!mdUp) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [mdUp]);
  
  useEffect(() => {
      handleScreenResize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mdUp]);
  
  const handeParamsUpdate = useCallback(() => {
    if (!mdUp) {
      setIsOpen(false);
    }
  }, [mdUp]);
  
  useEffect(() => {
      handeParamsUpdate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]);
  
  const handleToggle = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);
  
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  return {
    isOpen,
    handleToggle,
    handleClose
  };
};

const Page = () => {
  const rootRef = useRef(null);
  const {compose, threadKey} = useParams();
  const sidebar = useSidebar();
  
  //hook here
  
  const view = threadKey
    ? 'thread'
    : compose
      ? 'compose'
      : 'blank';
  
  return (
    <>
      <Head>
        <title>
          Support
        </title>
      </Head>
      <Typography sx={{mb:4}} variant={'h4'}>Support</Typography>
      <Divider/>
      <Box
        ref={rootRef}
        sx={{
          display: 'flex',
        }}
      >
        <ChatSidebar
          container={rootRef.current}
          onClose={sidebar.handleClose}
          open={sidebar.isOpen}
        />
        <ChatContainer open={sidebar.isOpen}>
          <Box sx={{p: 2}}>
            <IconButton onClick={sidebar.handleToggle}>
              <SvgIcon>
                <Menu01Icon/>
              </SvgIcon>
            </IconButton>
          </Box>
          <Divider/>
          {view === 'thread' && <ChatThread threadKey={threadKey}/>}
          {view === 'compose' && <ChatComposer/>}
          {view === 'blank' && <ChatBlank/>}
        </ChatContainer>
      </Box>
    </>
  );
};

export default Page;
