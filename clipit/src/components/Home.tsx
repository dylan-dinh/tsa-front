import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  styled 
} from '@mui/material';
import { addStreamer } from '../services/api';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  backgroundColor: '#2ea44f',
  '&:hover': {
    backgroundColor: '#2c974b',
  },
}));

const Home: React.FC = () => {
  const [streamerUrl, setStreamerUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await addStreamer(token, streamerUrl);
        setStreamerUrl('');
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to add streamer:', error);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Streamer Notifier
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph>
        Add your favorite streamers and get notified when they go live!
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="streamerUrl"
          label="Streamer URL or Name"
          name="streamerUrl"
          autoFocus
          value={streamerUrl}
          onChange={(e) => setStreamerUrl(e.target.value)}
        />
        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
        >
          Add Streamer
        </SubmitButton>
      </StyledForm>
    </StyledContainer>
  );
};

export default Home;