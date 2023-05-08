import {Button, Card, CardContent, Checkbox, Stack, TextField, Autocomplete} from "@mui/material";
import {CheckBox, CheckBoxOutlineBlank} from '@mui/icons-material'

export const UsersTab = ({onSubmit, users, selected, formik, changeTab, handleChange, ...props}) => {
  
  return (<>
    <Stack
      spacing={4}
      {...props}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Autocomplete
              multiple
              options={users}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              value={selected}
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
                handleChange(e, val)
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth
                           error={!!(formik.errors.users)}
                           helperText={formik.errors.users}
                           label="Users" placeholder="Select users"/>
              )}
            />
            <Stack direction={'row'} justifyContent={'end'}>
              <Button
                size="large"
                type="submit"
                variant="contained"
                onClick={e => {
                  formik.handleSubmit(e);
                  if (!formik.isValid && formik.errors.name) {
                    changeTab(e, 'common')
                  }
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