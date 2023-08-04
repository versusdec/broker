import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Stack,
  Table,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
  DialogActions,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  SvgIcon,
  Tooltip
} from "@mui/material";
import {CheckBox, CheckBoxOutlineBlank, Close, DeleteOutlined} from '@mui/icons-material'
import {useEffect, useState} from "react";
import {Scrollbar} from "../scrollbar";


export const ProjectsTab = ({dialog, setDialog, removeItem, validate, onSubmit, items, selected, onChange, handleChange, handleSetup, formik, ...props}) => {
  const [disabled, setDisabled] = useState(false)
  const [selectedItems, setSelectedItems] = useState(selected || [])
  
  useEffect(() => {
    if (selected?.length) {
      setSelectedItems(selected)
    }
  }, [selected])
  
  return (<>
    <Stack
      spacing={4}>
      <Card>
        
        <CardContent>
          <Stack spacing={3}>
            <Scrollbar>
              <Table sx={{minWidth: 700}}>
                {!Boolean(selected?.length) && <TableBody>
                  <TableRow>
                    <TableCell align={'center'}>
                      <Typography variant={'subtitle2'}>
                        Add to projects
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>}
                {Boolean(selected?.length) && <>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell/>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selected.map((item, i) => (<TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align={'right'}>
                        <Tooltip title={'Remove'}>
                          <IconButton
                            onClick={() => {
                              removeItem(i)
                            }}
                          >
                            <SvgIcon sx={{':hover': {color: 'primary.main'}}} fontSize={'small'}>
                              <DeleteOutlined/>
                            </SvgIcon>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>))}
                  </TableBody>
                </>}
              </Table>
            </Scrollbar>
            <Stack direction={'row'} justifyContent={'start'}>
              <Button
                disabled={disabled}
                variant={'contained'}
                onClick={async (e) => {
                  setDisabled(true);
                  setTimeout(() => {
                    setDisabled(false)
                  }, 500)
                  validate()
                }}
              >
                Save Changes
              </Button>
            </Stack>
          </Stack>
        
        </CardContent>
      </Card>
      <Dialog
        open={dialog}
        onClose={() => {
          setDialog(false)
        }}
        scroll={'paper'}
        maxWidth={'sm'}
        fullWidth
      >
        <DialogTitle sx={{pr: 10}}>
          <IconButton
            aria-label="close"
            onClick={() => {
              setDialog(false)
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.primary.main,
            }}
          >
            <Close/>
          </IconButton>
          Add to Project
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            fullWidth
            multiple
            options={items || []}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedItems || []}
            renderOption={(props, option, {selected}) => (
              <li {...props}>
                <Checkbox
                  icon={<CheckBoxOutlineBlank fontSize={'small'}/>}
                  checkedIcon={<CheckBox fontSize={'small'}/>}
                  style={{marginRight: 8}}
                  checked={selected}
                />
                {option.name}
              </li>
            )}
            onChange={(e, val) => {
              setSelectedItems(val)
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth
                         label="Projects" placeholder="Choose Projects"/>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type={'button'}
            variant={'outlined'}
            onClick={() => {
              setDialog(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type={'button'}
            variant={'contained'}
            onClick={() => {
              handleChange(selectedItems)
            }}
          >
            Add to Project
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  </>)
}