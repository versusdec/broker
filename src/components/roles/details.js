import {Box, Table, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, SvgIcon, TableCell, TableHead, TableRow, Typography, TableBody, Switch} from "@mui/material";
import {Input} from "../input";
import {Check, AddCircleOutlineOutlined, Close} from "@mui/icons-material";
import {useCallback, useEffect, useRef, useState} from "react";
import {MuiColorInput} from "mui-color-input";
import {Scrollbar} from "../scrollbar";

const colors = ['warning.main', 'primary.main', 'secondary.main', 'error.main', 'info.main', 'success.main']

const ColorTag = ({color, setColor, checked, ...props}) => {
  
  return <Box
    sx={{
      backgroundColor: color,
      borderRadius: '50%',
      width: 48,
      height: 48,
      cursor: 'pointer',
      position: 'relative'
    }}
    onClick={() => {
      setColor(color)
    }}
    {...props}
  >
    {checked && <SvgIcon
      sx={{
        color: 'white',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
      <Check/>
    </SvgIcon>}
  </Box>
}

export const Details = ({formik, role, handleGrants}) => {
  const [disabled, setDisabled] = useState(false);
  const [checkedTag, setCheckedTag] = useState(role?.color || 'warning.main');
  const [colorInput, setColorInput] = useState('#ffffff');
  const [dialog, setDialog] = useState(false);
  
  const handleDialogClose = useCallback(() => {
    setDialog(false)
  }, [])
  
  const handleDialogOpen = useCallback(() => {
    setDialog(true)
  }, [])
  
  const handleDialogSubmit = useCallback(() => {
    colors.push(colorInput)
    setDialog(false)
  }, [colorInput])
  
  
  return <>
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <form noValidate>
            <Stack spacing={3}>
              <Typography variant="h6">
                Basic details
              </Typography>
              <Input
                fullWidth
                label="Name"
                name="name"
                type="text"
                error={!!(formik.touched.name && formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              
              <Paper>
                <Box p={2}>
                  <Typography variant={'subtitle2'}>Color Tag</Typography>
                  <Stack direction={'row'} flexWrap={'wrap'} gap={1} pt={1}>
                    
                    {colors.map((color, i) => (<ColorTag key={i} color={color} checked={checkedTag === color} setColor={() => {
                      setCheckedTag(color)
                    }}/>))}
                    
                    <Box mt={-1} sx={{cursor: 'pointer'}} onClick={() => {
                      handleDialogOpen()
                    }}>
                      <SvgIcon
                        sx={{
                          color: 'primary.main',
                          fontSize: '56px',
                          marginTop: '4px',
                          marginLeft: '-4px'
                        }}>
                        <AddCircleOutlineOutlined/>
                      </SvgIcon>
                    
                    </Box>
                  </Stack>
                </Box>
              </Paper>
              
              <Stack direction={'row'}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={disabled}
                  onClick={(e) => {
                    setDisabled(true)
                    setTimeout(() => {
                      setDisabled(false)
                    }, 500)
                    formik.handleSubmit(e)
                  }}
                >
                  Save Changes
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">
            Integrations
          </Typography>
          <Scrollbar>
            <Table sx={{minWidth: 700}}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Event type
                  </TableCell>
                  <TableCell>
                    Access
                  </TableCell>
                  <TableCell>
                    Create
                  </TableCell>
                  <TableCell>
                    Edit
                  </TableCell>
                  <TableCell>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Logs
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.logs.access')}
                      onChange={() => {
                        handleGrants('integrations.logs.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.logs.create')}
                      onChange={() => {
                        handleGrants('integrations.logs.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.logs.edit')}
                      onChange={() => {
                        handleGrants('integrations.logs.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.logs.delete')}
                      onChange={() => {
                        handleGrants('integrations.logs.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Salesforce
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.salesforce.access')}
                      onChange={() => {
                        handleGrants('integrations.salesforce.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.salesforce.create')}
                      onChange={() => {
                        handleGrants('integrations.salesforce.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.salesforce.edit')}
                      onChange={() => {
                        handleGrants('integrations.salesforce.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.salesforce.delete')}
                      onChange={() => {
                        handleGrants('integrations.salesforce.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Webhooks
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.webhooks.access')}
                      onChange={() => {
                        handleGrants('integrations.webhooks.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.webhooks.create')}
                      onChange={() => {
                        handleGrants('integrations.webhooks.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.webhooks.edit')}
                      onChange={() => {
                        handleGrants('integrations.webhooks.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.webhooks.delete')}
                      onChange={() => {
                        handleGrants('integrations.webhooks.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Widgets
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.widgets.access')}
                      onChange={() => {
                        handleGrants('integrations.widgets.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.widgets.create')}
                      onChange={() => {
                        handleGrants('integrations.widgets.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.widgets.edit')}
                      onChange={() => {
                        handleGrants('integrations.widgets.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('integrations.widgets.delete')}
                      onChange={() => {
                        handleGrants('integrations.widgets.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </Stack>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">
            Modules
          </Typography>
          <Scrollbar>
            <Table sx={{minWidth: 700}}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Event type
                  </TableCell>
                  <TableCell>
                    Access
                  </TableCell>
                  <TableCell>
                    Create
                  </TableCell>
                  <TableCell>
                    Edit
                  </TableCell>
                  <TableCell>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Modules
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('modules.access')}
                      onChange={() => {
                        handleGrants('modules.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('modules.create')}
                      onChange={() => {
                        handleGrants('modules.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('modules.edit')}
                      onChange={() => {
                        handleGrants('modules.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('modules.delete')}
                      onChange={() => {
                        handleGrants('modules.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </Stack>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">
            Billing
          </Typography>
          <Scrollbar>
            <Table sx={{minWidth: 700}}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Event type
                  </TableCell>
                  <TableCell>
                    Access
                  </TableCell>
                  <TableCell>
                    Create
                  </TableCell>
                  <TableCell>
                    Edit
                  </TableCell>
                  <TableCell>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Payments
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('payments.access')}
                      onChange={() => {
                        handleGrants('payments.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('payments.create')}
                      onChange={() => {
                        handleGrants('payments.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('payments.edit')}
                      onChange={() => {
                        handleGrants('payments.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('payments.delete')}
                      onChange={() => {
                        handleGrants('payments.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Transactions
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('transactions.access')}
                      onChange={() => {
                        handleGrants('transactions.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('transactions.create')}
                      onChange={() => {
                        handleGrants('transactions.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('transactions.edit')}
                      onChange={() => {
                        handleGrants('transactions.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('transactions.delete')}
                      onChange={() => {
                        handleGrants('transactions.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </Stack>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">
            Projects
          </Typography>
          <Scrollbar>
            <Table sx={{minWidth: 700}}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Event type
                  </TableCell>
                  <TableCell>
                    Access
                  </TableCell>
                  <TableCell>
                    Create
                  </TableCell>
                  <TableCell>
                    Edit
                  </TableCell>
                  <TableCell>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Projects
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.access')}
                      onChange={() => {
                        handleGrants('projects.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.create')}
                      onChange={() => {
                        handleGrants('projects.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.edit')}
                      onChange={() => {
                        handleGrants('projects.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.delete')}
                      onChange={() => {
                        handleGrants('projects.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Categories
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.categories.access')}
                      onChange={() => {
                        handleGrants('projects.categories.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.categories.create')}
                      onChange={() => {
                        handleGrants('projects.categories.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.categories.edit')}
                      onChange={() => {
                        handleGrants('projects.categories.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.categories.delete')}
                      onChange={() => {
                        handleGrants('projects.categories.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Clients
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.clients.access')}
                      onChange={() => {
                        handleGrants('projects.clients.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.clients.create')}
                      onChange={() => {
                        handleGrants('projects.clients.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.clients.edit')}
                      onChange={() => {
                        handleGrants('projects.clients.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.clients.delete')}
                      onChange={() => {
                        handleGrants('projects.clients.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Contacts
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.contacts.access')}
                      onChange={() => {
                        handleGrants('projects.contacts.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.contacts.create')}
                      onChange={() => {
                        handleGrants('projects.contacts.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.contacts.edit')}
                      onChange={() => {
                        handleGrants('projects.contacts.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.contacts.delete')}
                      onChange={() => {
                        handleGrants('projects.contacts.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Fields
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.fields.access')}
                      onChange={() => {
                        handleGrants('projects.fields.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.fields.create')}
                      onChange={() => {
                        handleGrants('projects.fields.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.fields.edit')}
                      onChange={() => {
                        handleGrants('projects.fields.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.fields.delete')}
                      onChange={() => {
                        handleGrants('projects.fields.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Modules
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.modules.access')}
                      onChange={() => {
                        handleGrants('projects.modules.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.modules.create')}
                      onChange={() => {
                        handleGrants('projects.modules.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.modules.edit')}
                      onChange={() => {
                        handleGrants('projects.modules.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.modules.delete')}
                      onChange={() => {
                        handleGrants('projects.modules.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Queues
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.queues.access')}
                      onChange={() => {
                        handleGrants('projects.queues.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.queues.create')}
                      onChange={() => {
                        handleGrants('projects.queues.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.queues.edit')}
                      onChange={() => {
                        handleGrants('projects.queues.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.queues.delete')}
                      onChange={() => {
                        handleGrants('projects.queues.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Queues Users
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.queues.users.access')}
                      onChange={() => {
                        handleGrants('projects.queues.users.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.queues.users.create')}
                      onChange={() => {
                        handleGrants('projects.queues.users.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.queues.users.edit')}
                      onChange={() => {
                        handleGrants('projects.queues.users.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.queues.users.delete')}
                      onChange={() => {
                        handleGrants('projects.queues.users.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Scripts
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.scripts.access')}
                      onChange={() => {
                        handleGrants('projects.scripts.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.scripts.create')}
                      onChange={() => {
                        handleGrants('projects.scripts.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.scripts.edit')}
                      onChange={() => {
                        handleGrants('projects.scripts.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.scripts.delete')}
                      onChange={() => {
                        handleGrants('projects.scripts.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Sources
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.sources.access')}
                      onChange={() => {
                        handleGrants('projects.sources.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.sources.create')}
                      onChange={() => {
                        handleGrants('projects.sources.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.sources.edit')}
                      onChange={() => {
                        handleGrants('projects.sources.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.sources.delete')}
                      onChange={() => {
                        handleGrants('projects.sources.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Tags
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.tags.access')}
                      onChange={() => {
                        handleGrants('projects.tags.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.tags.create')}
                      onChange={() => {
                        handleGrants('projects.tags.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.tags.edit')}
                      onChange={() => {
                        handleGrants('projects.tags.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.tags.delete')}
                      onChange={() => {
                        handleGrants('projects.tags.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Widgets
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.widgets.access')}
                      onChange={() => {
                        handleGrants('projects.widgets.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.widgets.create')}
                      onChange={() => {
                        handleGrants('projects.widgets.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.widgets.edit')}
                      onChange={() => {
                        handleGrants('projects.widgets.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('projects.widgets.delete')}
                      onChange={() => {
                        handleGrants('projects.widgets.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </Stack>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">
            Roles
          </Typography>
          <Scrollbar>
            <Table sx={{minWidth: 700}}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Event type
                  </TableCell>
                  <TableCell>
                    Access
                  </TableCell>
                  <TableCell>
                    Create
                  </TableCell>
                  <TableCell>
                    Edit
                  </TableCell>
                  <TableCell>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Roles
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('roles.access')}
                      onChange={() => {
                        handleGrants('roles.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('roles.create')}
                      onChange={() => {
                        handleGrants('roles.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('roles.edit')}
                      onChange={() => {
                        handleGrants('roles.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('roles.delete')}
                      onChange={() => {
                        handleGrants('roles.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </Stack>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">
            Tariffs
          </Typography>
          <Scrollbar>
            <Table sx={{minWidth: 700}}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Event type
                  </TableCell>
                  <TableCell>
                    Access
                  </TableCell>
                  <TableCell>
                    Create
                  </TableCell>
                  <TableCell>
                    Edit
                  </TableCell>
                  <TableCell>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Tariffs
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('tariffs.access')}
                      onChange={() => {
                        handleGrants('tariffs.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('tariffs.create')}
                      onChange={() => {
                        handleGrants('tariffs.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('tariffs.edit')}
                      onChange={() => {
                        handleGrants('tariffs.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('tariffs.delete')}
                      onChange={() => {
                        handleGrants('tariffs.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </Stack>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">
            Users
          </Typography>
          <Scrollbar>
            <Table sx={{minWidth: 700}}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Event type
                  </TableCell>
                  <TableCell>
                    Access
                  </TableCell>
                  <TableCell>
                    Create
                  </TableCell>
                  <TableCell>
                    Edit
                  </TableCell>
                  <TableCell>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant={'subtitle2'}>
                      Tariffs
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('users.access')}
                      onChange={() => {
                        handleGrants('users.access')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('users.create')}
                      onChange={() => {
                        handleGrants('users.create')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('users.edit')}
                      onChange={() => {
                        handleGrants('users.edit')
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={role.grants.includes('users.delete')}
                      onChange={() => {
                        handleGrants('users.delete')
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </Stack>
      </CardContent>
    </Card>
    <Dialog
      open={dialog}
      onClose={handleDialogClose}
      scroll={'paper'}
      maxWidth={'sm'}
      fullWidth
    >
      <DialogTitle sx={{pr: 10}}>
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.primary.main,
          }}
        >
          <Close/>
        </IconButton>
        Select color
      </DialogTitle>
      <DialogContent dividers>
        <MuiColorInput fullWidth value={colorInput} onChange={setColorInput}/>
      </DialogContent>
      <DialogActions>
        <Button
          type={'button'}
          variant={'outlined'}
          color={'error'}
          onClick={handleDialogClose}
        >
          Cancel
        </Button>
        <Button
          type={'button'}
          variant={'contained'}
          onClick={() => {
            handleDialogSubmit()
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </>
}

