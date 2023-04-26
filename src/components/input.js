import {TextField} from "@mui/material";
import styled from "@emotion/styled";
import {useCallback, useEffect, useState} from "react";
import {MuiColorInput} from 'mui-color-input'

const Styled = styled(TextField)({
  '& .MuiFormHelperText-root.Mui-error': {
    position: 'absolute',
    top: '100%'
  },
  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none'
  }
})

export const Input = ({children, ...props}) => {
  const [value, setValue] = useState(props.value || '');
  
  useEffect(() => {
    setValue(props.value)
  }, [props.value])
  
  const onChange = (e) => {
    props.onChange(e)
  }
  
  return props.type === 'color' ?
    <MuiColorInput {...props} type='text'/> :
    <Styled {...props} value={value}
            onChange={(e) => {
              setValue(e.target.value)
              props.select ? onChange(e) : void 0;
            }}
            onBlur={(e) => {
              !props.select ? onChange(e) : void 0;
              props.handleBlur?.(e);
            }}
    >{children}</Styled>
}