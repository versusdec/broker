import {Box, IconButton, Stack, SvgIcon} from "@mui/material";
import {Close} from "@mui/icons-material";


export const Attachment = ({children, onRemove, ...props}) => {
  
  return <Stack
    direction={'row'}
    spacing={1}
    py={1}
    px={2}
    pr={2}
    alignItems={'center'}
    sx={{
      backgroundColor: 'primary.lightest',
      borderRadius: '12px'
    }}
    {...props}>
    <Box fontWeight={500}>{children}</Box>
    {onRemove && <IconButton
      color={'primary'}
      size={'small'}
      onClick={onRemove}
    >
      <Close fontSize={'small'}/>
    </IconButton>}
  </Stack>
}