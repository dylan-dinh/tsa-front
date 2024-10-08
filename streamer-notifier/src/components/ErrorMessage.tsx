import React from 'react';
import { Alert, Snackbar } from '@mui/material';

interface ErrorMessageProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, open, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorMessage;
