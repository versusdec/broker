import {TextField} from "@mui/material";
import styled from "@emotion/styled";
import {useEffect, useState} from "react";
import {MuiColorInput} from 'mui-color-input'

const Styled = styled(TextField)({
  '& .MuiFormHelperText-root.Mui-error': {
    position: 'absolute',
    top: '100%'
  },
  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
    'WebkitAppearance': 'none'
  },
  '& .MuiSelect-select': {
    paddingTop: 21
  }
})

export const Input = ({children, type, ...props}) => {
  const [value, setValue] = useState(props.value || '');
  
  useEffect(() => {
    setValue(props.value)
  }, [props.value])
  
  const onChange = (e) => {
    props.onChange?.(e)
  }
  
  switch (type) {
    case 'color':
      return  <MuiColorInput {...props} type='text'/>;
    /*case 'textarea':
      return <Textarea {...props}>{props.value}</Textarea>;*/
    default:
      return <Styled {...props} type={type} value={value}
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
}