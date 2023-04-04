import {TextField} from "@mui/material";
import styled from "@emotion/styled";
import {useEffect, useState} from "react";

const Styled = styled(TextField)({
  '& .MuiFormHelperText-root.Mui-error': {
    position: 'absolute',
    top: '100%'
  }
})

export const Input = ({children, ...props}) => {
  const [value, setValue] = useState(props.value || '');
 
  useEffect(()=>{
    setValue(props.value)
  }, [props.value])
  
  const onChange = (e) => {
    props.onChange(e)
  }
  
  return <Styled {...props} value={value}
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