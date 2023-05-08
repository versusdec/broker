import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Autocomplete
} from '@mui/material';
import {Input} from "../input";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/dist/client/compat/router";

export const CommonTab = ({onSubmit, onChange, isNew, userRole, item, formik, ...props}) => {
 

  
  
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
                  label="Description"
                  name="description"
                  type="text"
                  error={!!(formik.touched.description && formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e)
                    onChange({description: e.target.value})
                  }}
                  value={formik.values.description}
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
                <Stack direction={'row'} justifyContent={'end'}>
                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={formik.handleSubmit}
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
