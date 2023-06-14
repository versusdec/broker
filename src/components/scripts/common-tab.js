import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {Input} from "../input";
import {useState} from "react";

export const CommonTab = ({onSubmit, onChange, isNew, userRole, item, formik, ...props}) => {
  const [disabled, setDisabled] = useState(false);
  
  return (
    <Stack
      spacing={4}
      {...props}>
      <Card>
        <CardContent>
          
          <Stack spacing={3}>

              <Stack spacing={3}>
                <Input
                  fullWidth
                  label="Name"
                  name="name"
                  type="text"
                  error={!!(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e)
                    onChange({name: e.target.value})
                  }}
                  value={formik.values.name}
                />
                <Input
                  fullWidth
                  label="Status"
                  name="status"
                  onBlur={formik.handleBlur}
                  onChange={(e)=>{
                    formik.handleChange(e)
                    onChange({status: e.target.value})
                  }}
                  select
                  value={formik.values.status || 'active'}
                >
                  <MenuItem key={'active'} value={'active'}>
                    Active
                  </MenuItem>
                  <MenuItem key={'archived'} value={'archived'}>
                    Archived
                  </MenuItem>
                </Input>
                <Stack direction={'row'}>
                  <FormControlLabel control={<Checkbox checked={item.is_default} onChange={(e)=>{
                    onChange({is_default: e.target.checked})
                  }} />} label="Is default" />
                </Stack>
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
                    }}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
