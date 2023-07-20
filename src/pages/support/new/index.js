import {useCallback, useMemo, useState} from 'react';
import NextLink from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  MenuItem,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import {paths} from '../../../navigation/paths';
import {useRouter} from 'next/router'
import {useDispatch} from "../../../store";
import * as Yup from "yup";
import {useFormik} from "formik";
import {Input} from "../../../components/input";
import {AttachFileOutlined, CheckBox, CheckBoxOutlineBlank} from "@mui/icons-material";
import {api} from "../../../api";
import toast from "react-hot-toast";
import {FileUploader} from "../../../components/file-uploader";
import {Attachment} from "../../../components/attachment";

const validationSchema = Yup.object({
  name: Yup
    .string()
    .max(255)
    .required('Name is required'),
  message: Yup
    .string().required('Message is required'),
  theme: Yup
    .string()
    .oneOf(['tech', 'finance']),
});

const initialValues = {
  theme: 'tech',
  name: '',
  message: ''
}

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [files, setFiles] = useState([]);
  
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
      
      const {result, error} = await api.support.create(values);
      if (result) router.replace(paths.support.new + result);
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
                    name="name"
                    type="text"
                    error={!!(formik.touched.name && formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  <Input
                    fullWidth
                    label="Your Message"
                    name="message"
                    type="text"
                    multiline
                    rows={3}
                    error={!!(formik.touched.message && formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.description}
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
                      startIcon={(<AttachFileOutlined/>)}
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
