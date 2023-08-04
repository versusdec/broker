import { useState} from 'react';
import {
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import {Button} from '../button';
import {CasinoOutlined} from "@mui/icons-material";
import Generator from "generate-password";


export const SecurityTab = ({formik, validate, isAdmin, editGrant}) => {
  const [disabled, setDisabled] = useState(false);
  const isDisabled = !(isAdmin || editGrant);
  
  const generatePassword = () => {
    const pass = Generator.generate({
      numbers: true,
      symbols: true
    })
    formik.setFieldValue('password', pass).then(() => {
      formik.setFieldTouched('password', true, true)
    })
  }
  
  return (
    <Stack spacing={4}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack
                spacing={3}
              >
                <Typography variant="h6">
                  Change password
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={'text'}
                    value={formik.values.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              generatePassword()
                            }}
                            color={'primary'}
                          >
                            <CasinoOutlined/>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  {!isDisabled && <Stack justifyContent={'start'} direction={'row'} spacing={2}>
                    <Button
                      disabled={disabled}
                      onClick={(e) => {
                        setDisabled(true);
                        setTimeout(() => {
                          setDisabled(false)
                        }, 500)
                        validate()
                      }}
                    >Save Changes</Button>
                  </Stack>}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
