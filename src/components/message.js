import {Box, Stack, Paper, Avatar, Typography, Tooltip} from "@mui/material";
import {formatDistanceToNow, format} from 'date-fns'
import {Circle} from "@mui/icons-material";

export const Message = ({children, created, user, attachments, ...props}) => {
  
  return <>
    <Stack direction={user.is_me ? 'row' : 'row-reverse'} spacing={1} alignItems={'end'} width={'100%'}>
      <Box width={'100%'}>
        <Stack direction={'row'}>
          <Box
            component={Paper}
            maxWidth={{
              xs: '100%',
              md: '50%',
              lg: 628
            }}
            width={'100%'}
            sx={{
              borderRadius: '12px',
              ...(user.is_me && {
                backgroundColor: 'primary.main',
                color: 'common.white',
                borderBottomRightRadius: 0,
                ml: 'auto'
              }),
              ...(!user.is_me && {
                borderBottomLeftRadius: 0
              }),
            }}
            p={2}
          >
            {children}
          </Box>
        </Stack>
        <Stack direction={'row'} mt={1} spacing={1} sx={{
          ...(user.is_me && {
            justifyContent: 'end'
          })
        }}>
          <Typography variant={'subtitle2'}>{user.name + ' ' + user.surname}</Typography>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Circle sx={{color: 'neutral.500', fontSize: 4}}/>
            <Tooltip title={format(created * 1000, 'dd/MM/yyyy HH:mm')}><Typography variant={'body2'} color={'neutral.500'}>{formatDistanceToNow(created * 1000)} ago</Typography></Tooltip>
          </Stack>
        </Stack>
      </Box>
      <Box>
        <Box mb={4}><Avatar alt={`${user.name} ${user.surname}`} src={user.avatar} sx={{width: 64, height: 64}}/></Box>
      </Box>
    </Stack>
  </>
}