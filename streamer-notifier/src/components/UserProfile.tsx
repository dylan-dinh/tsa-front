import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { getUser, updateUser } from '../services/api';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState({ email: '' });
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await getUser(token);
        setUser(response.data);
        setNewEmail(response.data.email);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await updateUser(token, { email: newEmail });
        setUser({ ...user, email: newEmail });
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Update Profile
        </Button>
      </form>
    </Container>
  );
};

export default UserProfile;
