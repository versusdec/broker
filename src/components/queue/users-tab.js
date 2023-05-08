import {Button, Card, CardContent, Stack} from "@mui/material";

export const UsersTab = ({onSubmit, users, selected, formik, ...props}) => {
  
  return (<>
    <Stack
      spacing={4}
      {...props}>
      <Card>
        <CardContent>
        
          <Stack spacing={3}>
            <form noValidate>
              <Stack spacing={3}>
  
  
                <Stack direction={'row'} justifyContent={'end'}>
                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={formik.handleSubmit}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  </>)
}