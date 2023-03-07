import {getIn, Field, FastField} from 'formik'
import {TextField, Box, MenuItem} from '@mui/material'
import styled from "@emotion/styled";
import {useCallback, useEffect, useState} from "react";

const Styled = styled(TextField)({
  '& .MuiFormHelperText-root.Mui-error': {
    position: 'absolute',
    top: '100%'
  }
})

const CustomInput = (props) => {
  

  
  const [value, setValue] = useState(props.field.value)
  const isTouched = getIn(props.form.touched, props.field.name)
  const errorMessage = getIn(props.form.errors, props.field.name)
  
  const { error, helperText, field, form, select, options, ...rest } = props
  
  useEffect(() => {
    setValue(props.field.value)
  }, [props.field.value])
  
  const handleOnChange = useCallback(
    (event) => {
      setValue(event.target.value)
    },
    []
  )
  
  const FieldJSX = (
    <Styled
      select={select}
      variant={props.variant || 'outlined'}
      error={error ?? Boolean(isTouched && errorMessage)}
      helperText={
        helperText ?? (isTouched && errorMessage ? errorMessage : undefined)
      }
      {...field}
      {...rest}
      value={value}
      onChange={handleOnChange}
      onBlur={() => {
        props.form.setFieldValue(props.field.name, value)
      }}
      sx={{
        ...rest.sx,
        '& .MuiSelect-select': {
          paddingRight: props.adornment?.endAdornment
            ? '70px!important'
            : 'inherit',
        },
      }}
    >
      {options &&
      options.map((option) => {
        return (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        )
      })}
    </Styled>
  )
  
  return (
    <>
      {props.adornment?.endAdornment && (
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            maxWidth: '210px',
          }}
        >
          {FieldJSX}
          {props.adornment?.endAdornment && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                right: '30px',
              }}
            >
              {props.adornment.endAdornment}
            </Box>
          )}
        </Box>
      )}
      {!props.adornment?.endAdornment && FieldJSX}
    </>
  )
  
  return <Styled>{children}</Styled>
}

export const Input = (props) => {

  return props.fast ? (
    <FastField {...props} component={CustomInput}/>
  ) : (
    <Field {...props} component={CustomInput}/>
  )
}