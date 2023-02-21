import {Button as MuiButton} from '@mui/material'

export const Button = ({children, ...props}) => {
  
  return <MuiButton
    variant={props?.variant ? props.variant : 'contained'}
    {...props}
  >
    {children}
  </MuiButton>
}