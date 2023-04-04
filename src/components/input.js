import {TextField} from "@mui/material";
import styled from "@emotion/styled";
import {useState} from "react";

const Styled = styled(TextField)({
  '& .MuiFormHelperText-root.Mui-error': {
    position: 'absolute',
    top: '100%'
  }
})

export const Input = ({children, ...props}) => {
  const [value, setValue] = useState(props.value || '');
  
  const onChange = (e) => {
    props.onChange(e)
  }
  
  return <Styled {...props} value={value} onChange={(e) => {
    setValue(e.currentTarget.value)
  }} onBlur={(e) => {
    onChange(e);
    props.handleBlur?.(e);
  }}>{children}</Styled>
}