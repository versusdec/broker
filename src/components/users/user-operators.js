import {EditOutlined} from '@mui/icons-material'
import {
  Box,
  Card,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Avatar,
  Link
} from '@mui/material';
import {Scrollbar} from '../scrollbar';
import {Pagination} from "../pagination";
import NextLink from "next/link";
import {paths} from "../../navigation/paths";

export const OperatorsTab = (props) => {
  const {
    items,
    limit,
    page,
    total,
    onPageChange,
    handleLimitChange,
    users,
    editGrant,
    ...other
  } = props;
  
  return (
    <Card>
      <Box
        sx={{position: 'relative'}}
        {...other}>
        <Scrollbar>
          <Table sx={{minWidth: 700}}>
            {!!!users.length &&
            <TableBody>
              <TableRow>
                <TableCell align={'center'}>
                  <Typography variant={'subtitle2'}>
                    No operators attached to this user
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
            }
            {!!users.length &&
            <>
              <TableHead>
                <TableRow>
                  <TableCell>
                    ID
                  </TableCell>
                  <TableCell>
                    Name
                  </TableCell>
                  {editGrant && <TableCell align="right">
                    Actions
                  </TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => {
                  
                  return (
                    <TableRow
                      hover
                      key={user.id}
                    >
                      <TableCell>
                        {user.id}
                      </TableCell>
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={1}
                        >
                          <Avatar
                            src={user.avatar}
                            sx={{
                              height: 42,
                              width: 42
                            }}
                          />
                          <div>
                            {editGrant ? <Link
                              color="inherit"
                              component={NextLink}
                              href={`${paths.users.index}/${user.id}`}
                              variant="subtitle2"
                            >
                              {user.name}
                            </Link> : user.name}
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              {user.email}
                            </Typography>
                          </div>
                        </Stack>
                      </TableCell>
                      {editGrant && <TableCell align="right">
                        <Tooltip title={'Edit'}>
                          <IconButton
                            component={NextLink}
                            href={`${paths.users.index}/${user.id}`}
                          >
                            <SvgIcon color={'primary'}>
                              <EditOutlined/>
                            </SvgIcon>
                          </IconButton>
                        </Tooltip>
                      </TableCell>}
                    </TableRow>
                  );
                })}
              </TableBody>
            </>
            }
          </Table>
        </Scrollbar>
        <Pagination limit={limit} total={total} page={page} onPageChange={onPageChange} onLimitChange={handleLimitChange}/>
      </Box>
    </Card>
  );
};
