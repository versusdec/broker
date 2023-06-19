import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  Paper,
  Typography,
  IconButton, Box, Tooltip,
} from '@mui/material';
import {CancelOutlined} from "@mui/icons-material";
import {Input} from "../input";
import {createContext, useCallback, useContext, useEffect, useState} from "react";

const StepsContext = createContext(null);

const Answer = ({step_id, answer, index, stepIndex, ...props}) => {
  const {steps, onChange} = useContext(StepsContext);
  
  const handleChange = useCallback(({name, value}) => {
    const answers = steps[stepIndex].next;
    answers[index][name] = value;
    onChange({index: stepIndex, name: 'next', value: answers})
  }, [steps, index, onChange, stepIndex])
  
  const handleDelete = useCallback((index) => {
    const answers = [...steps[stepIndex].next];
    answers.splice(index, 1)
    onChange({index: stepIndex, name: 'next', value: answers})
  }, [steps, onChange, stepIndex])
  
  return <Stack spacing={2} direction={{sm: 'column', md: 'row'}} alignItems={'center'} {...props}>
    <Input
      name={'answer'}
      label={'Answer'}
      value={answer}
      onChange={(e) => {
        handleChange({name: e.target.name, value: e.target.value})
      }}/>
    <Input
      fullWidth
      label="Next step"
      name="step_id"
      onChange={(e) => {
        handleChange({name: e.target.name, value: e.target.value})
      }}
      select
      value={step_id}
    >
      {steps.map(item => (
        <MenuItem key={item.id} value={item.id}>
          {item.title === '' ? `Step #${item.id}` : item.title}
        </MenuItem>
      ))}
    </Input>
    <Box
      sx={{flexShrink: 0}}>
      
      <IconButton
        disabled={steps[stepIndex].next.length === 1}
        onClick={() => {
          handleDelete(index)
        }}
      >
        <Tooltip title={'Remove Answer'}>
          <CancelOutlined color={steps[stepIndex].next.length === 1 ? '' : 'error'}/>
        </Tooltip>
      </IconButton>
    </Box>
  </Stack>
}

const Step = ({id, title, text, field_id, next, index, onDelete, ...props}) => {
  const {fields, steps, onChange} = useContext(StepsContext);
  
  const handleAnswerAdd = useCallback(() => {
    const answers = [...steps[index].next];
    answers.push({
      "step_id": 1,
      "answer": ""
    })
    onChange({index: index, name: 'next', value: answers})
  }, [steps, index, onChange])
  
  return <Paper sx={{p: 2}} key={id} elevation={5} {...props}>
    <Stack spacing={4} direction={{xs: 'column', md: 'row'}}>
      <Stack spacing={3} flexGrow={1}>
        <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant={'subtitle1'}>Step #{index + 1}</Typography>
          <Button
            variant={'outlined'}
            disabled={steps.length === 1}
            onClick={() => {
              onDelete(index)
            }}
          >Delete</Button>
        </Stack>
        <Input
          fullWidth
          name={'title'}
          label={'Name'}
          value={title}
          onChange={(e) => {
            onChange({index: index, name: e.target.name, value: e.target.value})
          }}/>
        <Input
          fullWidth
          multiline
          maxRows={5}
          name={'text'}
          label={'Text'}
          value={text}
          onChange={(e) => {
            onChange({index: index, name: e.target.name, value: e.target.value})
          }}/>
        <Input
          fullWidth
          label="Qualification"
          name="field_id"
          onChange={(e) => {
            onChange({index: index, name: e.target.name, value: e.target.value})
          }}
          select
          value={field_id}
        >
          <MenuItem key={'0'} value={''}>Not selected</MenuItem>
          {fields.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item.label}
            </MenuItem>
          ))}
        
        </Input>
      </Stack>
      <Stack
        sx={{
          width: {
            sm: '100%',
            md: '50%',
            xl: 500
          }
        }}
        spacing={3}
      >
        <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant={'subtitle1'}>Answer options</Typography>
          <Button
            variant={'outlined'}
            onClick={() => {
              handleAnswerAdd()
            }}
          >Add</Button>
        </Stack>
        {next.map((item, i) => (<Answer {...item} stepIndex={index} index={i} key={i}/>))}
      </Stack>
    </Stack>
  </Paper>
}

export const StepsTab = ({onSubmit, onChange, isNew, userRole, item, fields, changeTab, formik, initialStep, ...props}) => {
  const [disabled, setDisabled] = useState(false);
  const [steps, setSteps] = useState(item.steps);
  
  useEffect(() => {
    onChange({steps: steps})
  }, [steps, onChange])
  
  const handleStepValueChange = useCallback(({index, name, value}) => {
    const data = JSON.parse(JSON.stringify(steps));
    data[index][name] = value;
    setSteps(data)
  }, [steps])
  
  const handleRemoveStep = useCallback((index) => {
    const data = [...steps]
    data.splice(index, 1)
    setSteps(data)
  }, [steps])
  
  const addStep = useCallback(() => {
    const step = {...initialStep, id: steps[steps.length - 1].id + 1};
    setSteps(prev => ([...prev, step]))
  }, [steps, initialStep])
  
  
  return (
    <StepsContext.Provider
      value={
        {
          fields,
          steps,
          onChange: handleStepValueChange
        }
      }>
      <Stack
        spacing={4}
        {...props}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={'row'} justifyContent={'flex-end'}>
                <Button
                  variant={'contained'}
                  onClick={addStep}
                >
                  Add step
                </Button>
              </Stack>
              {steps.map((item, i) => (<Step {...item} index={i} key={i} onDelete={handleRemoveStep}/>))}
              <Stack direction={'row'} justifyContent={'flex-end'}>
                <Button
                  variant={'contained'}
                  onClick={addStep}
                >
                  Add step
                </Button>
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
                    if (formik.errors.name) {
                      changeTab(e, 'common')
                    } else if (formik.errors.statuses) {
                      changeTab(e, 'statuses')
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
    </StepsContext.Provider>
  );
};
