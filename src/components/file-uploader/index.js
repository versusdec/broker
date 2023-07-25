import {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogContent, IconButton, Stack, SvgIcon, Typography} from '@mui/material';
import {FileDropzone} from '../file-dropzone';
import XIcon from '@untitled-ui/icons-react/build/esm/X';

export const FileUploader = (props) => {
  const {onClose, open = false, onUpload} = props;
  const [files, setFiles] = useState([]);
  const multiple = props.multiple ?? false;
  const deny = Boolean(!multiple && files.length);
  
  useEffect(() => {
    setFiles([]);
  }, [open]);
  
  const handleDrop = useCallback((newFiles) => {
    if (!deny) {
      setFiles((prevFiles) => {
        return [...prevFiles, ...newFiles];
      });
    }
  }, [deny]);
  
  const handleRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);
  
  const handleRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);
  
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{
          px: 3,
          py: 2
        }}
      >
        <Typography variant="h6">
          Upload Files
        </Typography>
        <IconButton
          color="inherit"
          onClick={onClose}
        >
          <SvgIcon>
            <XIcon/>
          </SvgIcon>
        </IconButton>
      </Stack>
      <DialogContent>
        <FileDropzone
          files={files}
          onDrop={handleDrop}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          onUpload={() => {
            onClose();
            onUpload(files)
          }}
          {...props}
        />
      </DialogContent>
    </Dialog>
  );
};

FileUploader.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
