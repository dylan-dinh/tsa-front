const { jwtDecode } = require('jwt-decode');

// Test simple des fonctions JWT
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

try {
  const payload = jwtDecode(validToken);
  console.log('✅ JWT decode test passed');
  console.log('Payload:', payload);
  console.log('User ID:', payload.sub);
  console.log('Expires:', new Date(payload.exp * 1000).toLocaleString());
  
  // Test d'expiration
  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = payload.exp < currentTime;
  console.log('Is expired:', isExpired);
  
} catch (error) {
  console.log('❌ JWT decode test failed:', error.message);
} 