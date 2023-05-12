import {Button, Card, CardContent, Checkbox, Stack, TextField, Autocomplete} from "@mui/material";
import {CheckBox, CheckBoxOutlineBlank} from '@mui/icons-material'
import {useState} from "react";

export const QueuesTab = ({onSubmit, items, selected, formik, onChange, tabChange, ...props}) => {
  const [disabled, setDisabled] = useState(false);
  
  return (<>
    <Stack
      spacing={4}
      {...props}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Autocomplete
              multiple
              options={items}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selected || []}
              renderOption={(props, option, {selected}) => (
                <li {...props} key={option.id}>
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
              renderInput={(params) => (
                <TextField {...params} fullWidth
                           error={!!(formik.errors.users)}
                           helperText={formik.errors.users}
                           label="Queues" placeholder="Select queues"/>
              )}
            />
            <Stack direction={'row'} justifyContent={'end'}>
              <Button
                size="large"
                type="submit"
                variant="contained"
                disabled={disabled}
                onClick={e => {
                  if (!formik.isValid)
                    return tabChange(e, 'common')
                  setDisabled(true);
                  setTimeout(() => {
                    setDisabled(false)
                  }, 500)
                  formik.handleSubmit(e);
                }}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  </>)
}