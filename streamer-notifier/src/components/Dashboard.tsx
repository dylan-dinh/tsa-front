import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import { getStreamers, removeStreamer } from '../services/api';
import { Streamer } from '../types';
import LoadingSpinner from './Loading';

const Dashboard: React.FC = () => {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [worker, setWorker] = useState<Worker | null>(null);
  const navigate = useNavigate();

  const fetchStreamers = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await getStreamers(token);
        setStreamers(response.data);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to fetch streamers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchStreamers();
  }, [fetchStreamers]);

  useEffect(() => {
    const newWorker = new Worker(new URL('../worker/web_worker.tsx', import.meta.url));
    setWorker(newWorker);

    return () => {
      newWorker.terminate();
    };
  }, []);

  useEffect(() => {
    if (worker && streamers.length > 0) {
      worker.postMessage({ streamers });
      worker.onmessage = (event) => {
        if (event.data.type === 'STREAMER_LIVE') {
          alert(`${event.data.streamer} has gone live!`);
        }
      };
    }
  }, [worker, streamers]);

  const handleRemoveStreamer = async (streamerId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await removeStreamer(token, streamerId);
        setStreamers(streamers.filter(streamer => streamer.id !== streamerId));
      }
    } catch (error) {
      console.error('Failed to remove streamer:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="md">
      <Box mt={8}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          style={{ marginBottom: '20px' }}
        >
          Logout
        </Button>
        <Typography variant="h6" gutterBottom>
          Your Streamers:
        </Typography>
        <List>
          {streamers.map((streamer) => (
            <ListItem key={streamer.id}>
              <ListItemText primary={streamer.name} />
              <Button onClick={() => handleRemoveStreamer(streamer.id)}>Remove</Button>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          style={{ marginTop: '20px' }}
        >
          Add New Streamer
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;