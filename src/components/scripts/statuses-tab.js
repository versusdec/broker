import {useCallback, useEffect, useState} from 'react';
import {Block, CancelOutlined, CheckCircleOutlined, Close, DeleteOutlined, EditOutlined} from '@mui/icons-material'
import {
  Box,
  Button,
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
  MenuItem,
  CardContent,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl
} from '@mui/material';
import {Scrollbar} from '../scrollbar';
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {Input} from "../input";

export const StatusesTab = (props) => {
  const {
    item,
    changeTab,
    formik,
    onChange,
    initialStatus,
    ...other
  } = props;
  const [disabled, setDisabled] = useState(false)
  const [statuses, setStatuses] = useState(item.statuses)
  
  useEffect(() => {
    onChange({statuses: statuses})
  }, [statuses])
  
  const handleAdd = useCallback(() => {
    setStatuses(prev => ([...prev, initialStatus]))
  }, [statuses])
  
  const handleRemove = useCallback((index) => {
    const data = [...statuses]
    data.splice(index, 1)
    setStatuses(data)
  }, [statuses])
  
  const handleChange = useCallback(({name, value, index}) => {
    const stats = JSON.parse(JSON.stringify(statuses))
    stats[index][name] = value;
    setStatuses(stats)
  }, [statuses])
  
  useEffect(() => {
    onChange({statuses: statuses})
  }, [statuses])
  
  return (
    <Card>
      
      <Box
        sx={{position: 'relative'}}
        {...other}>
        <Stack
          alignItems="center"
          justifyContent="flex-end"
          direction="row"
          spacing={3}
          sx={{p: 3}}
        >
          <Button
            onClick={handleAdd}
            startIcon={(
              <SvgIcon>
                <PlusIcon/>
              </SvgIcon>
            )}
            variant="contained"
          >
            Add
          </Button>
        </Stack>
        <Scrollbar>
            <Table sx={{minWidth: 700}} >
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Label
                    </TableCell>
                    <TableCell>
                      Name
                    </TableCell>
                    <TableCell>
                      Actions
                    </TableCell>
                    <TableCell/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statuses.map((item, i) => {
          
                    return (
                      <TableRow
                        hover
                        key={i}
                      >
                        <TableCell>
                          <Input
                            fullWidth
                            label="Label"
                            name={`statuses.${i}.label`}
                            type="text"
                            error={!!(formik.touched.statuses?.[i]?.label && formik.errors.statuses?.[i]?.label)}
                            helperText={formik.touched.statuses?.[i]?.label && formik.errors.statuses?.[i]?.label}
                            onChange={(e) => {
                              formik.handleChange(e)
                              handleChange({name: 'label', value: e.target.value, index: i})
                            }}
                            value={item.label}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            fullWidth
                            label="Name"
                            name={`statuses.${i}.name`}
                            type="text"
                            error={!!(formik.touched.statuses?.[i]?.name && formik.errors.statuses?.[i]?.name)}
                            helperText={formik.touched.statuses?.[i]?.name && formik.errors.statuses?.[i]?.name}
                            onChange={(e) => {
                              formik.handleChange(e)
                              handleChange({name: 'name', value: e.target.value, index: i})
                            }}
                            value={item.name}
                          />
                        </TableCell>
                        <TableCell>
                          {item && <FormControl>
                            <InputLabel id="actions-label">Actions</InputLabel>
                            <Select
                              multiple
                              sx={{maxWidth: 300}}
                              value={statuses[i].actions}
                              label={'test'}
                              labelId="actions-label"
                              onChange={(e) => {
                                const stats = [...statuses]
                                const index = stats[i].actions.findIndex(item => item.name === e.target.value[e.target.value.length - 1].name)
                                if (index >= 0) stats[i].actions.splice(index, 1)
                                else stats[i].actions = e.target.value;
                                setStatuses(stats)
                              }}
                              input={<OutlinedInput fullWidth/>}
                              renderValue={(selected) => {
                                const values = selected.map(item => item.name)
                                return values.join(', ')
                              }}
                            >
                              <MenuItem key={'assign_recall'} value={{name: 'assign_recall'}}>
                                <Checkbox checked={statuses[i].actions.filter(item => item.name === 'assign_recall').length > 0}/>
                                <ListItemText primary={'assign_recall'}/>
                              </MenuItem>
                              <MenuItem key={'add_tag'} value={{name: 'add_tag'}}>
                                <Checkbox checked={statuses[i].actions.filter(item => item.name === 'add_tag').length > 0}/>
                                <ListItemText primary={'add_tag'}/>
                              </MenuItem>
                              <MenuItem key={'add_blacklist'} value={{name: 'add_blacklist'}}>
                                <Checkbox checked={statuses[i].actions.filter(item => item.name === 'add_blacklist').length > 0}/>
                                <ListItemText primary={'add_blacklist'}/>
                              </MenuItem>
                              <MenuItem key={'send_sms'} value={{name: 'send_sms'}}>
                                <Checkbox checked={statuses[i].actions.filter(item => item.name === 'send_sms').length > 0}/>
                                <ListItemText primary={'send_sms'}/>
                              </MenuItem>
                  
                            </Select>
                          </FormControl>}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            disabled={statuses.length === 1}
                            onClick={() => {
                              handleRemove(i)
                            }}
                          >
                            <Tooltip title={'Remove'}>
                              <SvgIcon color={statuses.length === 1 ? '' : 'error'}>
                                <CancelOutlined/>
                              </SvgIcon>
                            </Tooltip>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </>
  
            </Table>
        </Scrollbar>
      </Box>
      <CardContent>
        <Stack direction={'row'} justifyContent={'end'}>
          <Button
            size="large"
            type="submit"
            variant="contained"
            disabled={disabled}
            onClick={e => {
              setDisabled(true);
              setTimeout(() => {
                setDisabled(false)
              }, 500)
              formik.handleSubmit(e);
              if(!formik.errors.statuses && !formik.isValid){
                changeTab(e, 'common')
              }
            }}
          >
            Save
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
