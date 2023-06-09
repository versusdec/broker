import {Button, Card, CardContent, Checkbox, Stack, TextField, Autocomplete} from "@mui/material";
import {CheckBox, CheckBoxOutlineBlank} from '@mui/icons-material'
import {Loader} from "../loader";
import {useState} from "react";

export const QueuesTab = ({onSubmit, items, selected, onChange, handleChange, handleSetup, role, loading, ...props}) => {
  const [disabled, setDisabled] = useState(false)
  
  return (<>
    {loading && <Loader backdrop={true}/>}
    <Stack
      spacing={4}
      {...props}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Autocomplete
              fullWidth
              multiple
              options={items}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selected || []}
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
                onChange(val)
              }}
              onClose={() => {
                handleChange()
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth
                           label="Queues" placeholder="Select queues"/>
              )}
            />
            {/*{role === 'manager' && <Stack direction={'row'} justifyContent={'end'}>
              <Button
                size="large"
                variant="contained"
                disabled={disabled}
                onClick={e => {
                  setDisabled(true);
                  setTimeout(() => {
                    setDisabled(false)
                  }, 500)
                  handleSetup()
                }}
              >
                Apply to all operators
              </Button>
            </Stack>}*/}
          </Stack>
        
        </CardContent>
      </Card>
    </Stack>
  </>)
}