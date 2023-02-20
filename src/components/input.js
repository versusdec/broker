import {TextField} from "@mui/material";
import styled from "@emotion/styled";

export const Input = ({children, ...props}) => {
  
  const Styled = styled(TextField)({
    '& .MuiFormHelperText-root.Mui-error': {
      position: 'absolute',
      top: '100%'
    }
  })
  
  return <Styled {...props}>{children}</Styled>
}