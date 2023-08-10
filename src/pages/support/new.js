import {useCallback, useEffect, useState} from 'react';
import NextLink from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
  Button,
  Card,
  CardContent,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  SvgIcon,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  List,
  Unstable_Grid2 as Grid, TableBody,
} from '@mui/material';
import {paths} from '../../navigation/paths';
import {useRouter} from 'next/router'
import * as Yup from "yup";
import {useFormik} from "formik";
import {Input} from "../../components/input";
import {AttachFileOutlined, Circle} from "@mui/icons-material";
import {api} from "../../api";
import toast from "react-hot-toast";
import {FileUploader} from "../../components/file-uploader";
import {Attachment} from "../../components/attachment";

const validationSchema = Yup.object({
  title: Yup
    .string()
    .max(255)
    .required('Name is required'),
  text: Yup
    .string().required('Message is required'),
  theme: Yup
    .string()
    .oneOf(['tech', 'finance']),
});

const initialValues = {
  theme: 'tech',
  title: '',
  text: ''
}

const Page = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const getStats = async () => {
      const {result} = await api.support.stats();
      return result
    }
    
    setStats(getStats())
  }, [])
  
  const handleOpen = useCallback(() => {
    setUploaderOpen(true)
  }, [])
  
  const handleClose = useCallback(() => {
    setUploaderOpen(false)
  }, [])
  
  const onUpload = useCallback((files) => {
    setFiles(prev => ([...prev, ...files]))
    console.log(files)
  }, [])
  
  const onFileRemove = useCallback((i) => {
    const f = [...files]
    f.splice(i, 1)
    setFiles(f)
  }, [files])
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    errors: {},
    onSubmit: async (values, helpers) => {
      if (files.length) {
        const attachments = [];
        files.forEach(e => {
          attachments.push({
            type: e.type,
            data: {
              path: e.path,
              name: e.name
            }
          })
        });
        values.attachments = attachments;
      }
      
      const {result, error} = await api.support.add(values);
      if (result) router.replace(paths.support.index + result);
      else if (error) {
        console.log(error)
        toast.error('Something went wrong')
      }
    }
  })
  
  return (
    <>
      <Stack spacing={4} mb={3}>
        <div>
          <Link
            color="text.primary"
            component={NextLink}
            href={paths.support.index}
            sx={{
              alignItems: 'center',
              display: 'inline-flex'
            }}
            underline="hover"
          >
            <SvgIcon sx={{mr: 1}}>
              <ArrowLeftIcon/>
            </SvgIcon>
            <Typography variant="subtitle2">
              Support
            </Typography>
          </Link>
        </div>
        <Stack
          alignItems="flex-start"
          direction={{
            xs: 'column',
            md: 'row'
          }}
          justifyContent="space-between"
          spacing={4}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Stack>
              <Typography variant="h4">
                Create a New Ticket
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        spacing={4}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <form noValidate>
                    <Stack spacing={3}>
                      <Typography variant={'h6'}>Contact Technical Support</Typography>
                      <Input
                        fullWidth
                        label="Select Theme"
                        name="theme"
                        onChange={formik.handleChange}
                        select
                        value={formik.values.theme}
                      >
                        <MenuItem key={'tech'} value={'tech'}>
                          Technical
                        </MenuItem>
                        <MenuItem key={'finance'} value={'finance'}>
                          Financial
                        </MenuItem>
                      </Input>
                      <Input
                        fullWidth
                        label="Title of Your Problem"
                        name="title"
                        type="text"
                        error={!!(formik.touched.title && formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.title}
                      />
                      <Input
                        fullWidth
                        label="Your Message"
                        name="text"
                        type="text"
                        multiline
                        rows={3}
                        error={!!(formik.touched.text && formik.errors.text)}
                        helperText={formik.touched.text && formik.errors.text}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.text}
                      />
                      {Boolean(files.length) && <Stack direction={'row'} spacing={1}>
                        {files.map((file, i) => (<Attachment onRemove={() => {
                          onFileRemove(i)
                        }} key={i}>{file.name}</Attachment>))}
                      </Stack>}
                      <Stack direction={'row'} spacing={2}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={disabled}
                          onClick={(e) => {
                            setDisabled(true)
                            setTimeout(() => {
                              setDisabled(false)
                            }, 500)
                            formik.handleSubmit(e)
                          }}
                        >
                          Send Message
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={(<AttachFileOutlined sx={{transform: 'rotate(45deg)'}}/>)}
                          onClick={handleOpen}
                        >
                          Attach File
                        </Button>
                      
                      </Stack>
                    </Stack>
                  </form>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} md={4}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant={'h6'}>
                      Average Response Time
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Last hour</TableCell>
                            <TableCell><Typography variant={'subtitle2'}>{(stats?.common && stats.common + 'min') || '15 minutes'}</Typography></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>To your tickets</TableCell>
                            <TableCell><Typography variant={'subtitle2'}>{(stats?.my_tickets && stats.my_tickets + 'min') || '5 minutes'}</Typography></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant={'h6'}>
                      How to Get an Answer Faster
                    </Typography>
                    <List disablePadding>
                      <ListItem disablePadding>
                        <ListItemIcon>
                          <Circle color={'primary'} sx={{fontSize: '7px'}}/>
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant={'body2'}>
                            Provide access data to the server and website.
                          </Typography>
                        </ListItemText>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemIcon>
                          <Circle color={'primary'} sx={{fontSize: '7px'}}/>
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant={'body2'}>
                            Describe the sequence of actions leading to the problem.
                          </Typography>
                        </ListItemText>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemIcon>
                          <Circle color={'primary'} sx={{fontSize: '7px'}}/>
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant={'body2'}>
                            Attach screenshot.
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    
                    </List>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          
          </Grid>
        </Grid>
      </Stack>
      <FileUploader
        onClose={handleClose}
        open={uploaderOpen}
        onUpload={(files) => {
          onUpload(files)
          handleClose()
        }}
        multiple={true}
      />
    </>
  );
}

export default Page;

Page.defaultProps = {
  title: 'Support'
}
