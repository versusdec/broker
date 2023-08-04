import {useCallback, useEffect, useRef, useState} from 'react';
import NextLink from 'next/link';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  SvgIcon,
  Typography,
  Box,
} from '@mui/material';
import {paths} from '../../navigation/paths';
import {useRouter} from 'next/router'
import {useDispatch} from "../../store";
import * as Yup from "yup";
import {useFormik} from "formik";
import {Input} from "../../components/input";
import {AttachFileOutlined, Circle} from "@mui/icons-material";
import {api} from "../../api";
import toast from "react-hot-toast";
import {FileUploader} from "../../components/file-uploader";
import {Attachment} from "../../components/attachment";
import {Message} from "../../components/message";
import {Scrollbar} from "../../components/scrollbar";
import {useTicket} from "../../hooks/useTicket";
import {ticketsGet} from "../../slices/ticketsSlice";


const validationSchema = Yup.object({
  text: Yup
    .string().required('Message is required'),
});

const initialValues = {
  text: '',
}

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const id = +router.query.id;
  const topBlock = useRef(null)
  const botBlock = useRef(null)
  const chatBlock = useRef(null)
  const [height, setHeight] = useState('100%')
  const [ticket, setTicket] = useState(null);
  const {data, loading, error} = useTicket(id);
  
  useEffect(() => {
    if (data) setTicket(data)
  }, [data])
  
  useEffect(()=>{
  
  }, [])
  
  useEffect(() => {
    setTimeout(()=>{
      if (topBlock.current && botBlock.current) {
        const innerHeight = window.innerHeight;
        const offsetHeight = document.getElementsByTagName('body')[0].offsetHeight;
        const top = topBlock.current.getBoundingClientRect().bottom + 48
        const bottom = offsetHeight - botBlock.current.getBoundingClientRect().top + 24
    
        setHeight(innerHeight - bottom - top)
      }
    }, 500)
  }, [topBlock, botBlock])
  
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatBlock.current && Boolean(height)) {
        const element = chatBlock.current;
        element.scrollTop = element.scrollHeight - element.clientHeight;
      }
    };
    
    scrollToBottom();
  }, [height, chatBlock, ticket])
  
  
  const handleOpen = useCallback(() => {
    setUploaderOpen(true)
  }, [])
  
  const handleClose = useCallback(() => {
    setUploaderOpen(false)
  }, [])
  
  const onUpload = useCallback((files) => {
    setFiles(prev => ([...prev, ...files]))
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
      values.id = id;
      
      const {result, error} = await api.support.answer(values);
      if (result) {
        formik.setFieldValue('text', '');
        formik.setFieldTouched('text', false)
        setFiles([])
        dispatch(ticketsGet(id))
      } else if (error) {
        console.log(error)
        toast.error('Something went wrong')
      }
    }
  })
  
  return ticket && (
    <>
      <Stack display={'flex'} direction={'column'} spacing={3} height={'100%'}>
        <Stack ref={topBlock} spacing={4} mb={3}>
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
                  Ticket #{ticket.id}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Box flexGrow={1}>
          <Scrollbar scrollableNodeProps={{ref: chatBlock}} style={{maxHeight: height}} sx={{}}>
            {ticket && Boolean(ticket.messages.length) && <Stack spacing={2}>
              {ticket.messages.map(item => <Message key={item.id} {...item}>{item.text}</Message>)}
            </Stack>}
          </Scrollbar>
        </Box>
        <Card ref={botBlock}>
          <CardContent>
            <Stack spacing={3}>
              <form noValidate>
                <Stack spacing={3}>
                  
                  <Input
                    fullWidth
                    label="Your Reply"
                    name="text"
                    type="text"
                    multiline
                    maxRows={3}
                    error={!!(formik.touched.text && formik.errors.text)}
                    helperText={formik.touched.text && formik.errors.text}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.text}
                  />
                  {Boolean(files.length) && <Stack direction={'row'} gap={1}>
                    {files.map((file, i) => (<Attachment key={i} onRemove={() => {
                      onFileRemove(i)
                    }}>{file.name}</Attachment>))}
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
