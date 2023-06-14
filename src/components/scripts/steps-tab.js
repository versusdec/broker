import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  Checkbox,
  FormControlLabel, Paper, CardActions,
} from '@mui/material';
import {Input} from "../input";
import {useState} from "react";

const initialStep = {
  "title": "",
  "text": "",
  "id": 1,
  "next": [
    {
      "step_id": 1,
      "answer": ""
    }
  ],
  "field_id": 1
}

export const Step = (props)=> {
  
  return <Paper sx={{p: 2}}>
    IM PAPER
  </Paper>
}

export const StepsTab = ({onSubmit, onChange, isNew, userRole, item, formik, changeTab, ...props}) => {
  const [disabled, setDisabled] = useState(false);
  const [steps, setSteps] = useState(item.steps || []);
  
  
  return (
    <Stack
      spacing={4}
      {...props}>
      <Card>
        <CardContent>
            <Stack spacing={3}>
  
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
                    if (!formik.isValid) {
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
  );
};
