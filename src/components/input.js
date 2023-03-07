import {TextField} from "@mui/material";
import styled from "@emotion/styled";

const Styled = styled(TextField)({
  '& .MuiFormHelperText-root.Mui-error': {
    position: 'absolute',
    top: '100%'
  }
})

export const Input = ({children, ...props}) => {
  
  return <Styled {...props}>{children}</Styled>
}