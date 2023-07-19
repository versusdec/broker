import {
  Box,
  Card,
  CardContent, Checkbox,
  Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow,
  Typography,
} from '@mui/material';
import {Scrollbar} from "../scrollbar";

const notifications = [
  {
    event: 'projects.update',
    destinations: ['app', 'email', 'tg']
  },
  {
    event: 'payments.accepted',
    destinations: []
  },
  {
    event: 'payments.declined',
    destinations: []
  },

]


export const AccountNotificationsSettings = ({user, ...props}) => {
  
  
  return (
    <>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6">
                Notifications Type
              </Typography>
              
            </Stack>
          </CardContent>
          <Box sx={{position: 'relative'}}>
            <Scrollbar>
              <Table sx={{minWidth: 700}}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" >
                      <Stack direction={'row'} spacing={2} alignItems={'center'}>
                        <Box sx={{whiteSpace: 'nowrap', flexShrink: 0}}>Event Type</Box>
                      </Stack>
                    </TableCell>
                    <TableCell align={'center'}>
                      In App
                    </TableCell>
                    <TableCell align={'center'}>
                      Email
                    </TableCell>
                    <TableCell align={'center'}>
                      Telegram
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell width={'50%'}>
                      <Typography >Projects Update</Typography>
                      <Typography color={'neutral.500'} variant={'body2'}>Stay tuned if something in your project has changed</Typography>
                    </TableCell>
                    <TableCell align={'center'}>
                      <Switch
                        onChange={(e)=>{
                          console.log(e.target.checked)
                        }}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <Switch />
                    </TableCell>
                    <TableCell align={'center'}>
                      <Switch />
                    </TableCell>
          
                  </TableRow>
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
        </Card>
      </Stack>
    </>
  );
};