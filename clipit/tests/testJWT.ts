import { verifyJWT, extractUserFromToken, isTokenExpiringSoon } from './jwt';

// Test simple pour vérifier l'implémentation JWT
export const testJWTImplementation = () => {
  console.log('🧪 Testing JWT Implementation...\n');

  // Test 1: Token valide
  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  
  console.log('Test 1: Valid JWT Token');
  const validResult = verifyJWT(validToken);
  console.log('Result:', validResult);
  console.log('✅ Valid token test:', validResult.isValid ? 'PASSED' : 'FAILED');
  console.log('');

  // Test 2: Token expiré
  const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjF9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  
  console.log('Test 2: Expired JWT Token');
  const expiredResult = verifyJWT(expiredToken);
  console.log('Result:', expiredResult);
  console.log('✅ Expired token test:', !expiredResult.isValid ? 'PASSED' : 'FAILED');
  console.log('');

  // Test 3: Token malformé
  console.log('Test 3: Malformed JWT Token');
  const malformedResult = verifyJWT('invalid.token.here');
  console.log('Result:', malformedResult);
  console.log('✅ Malformed token test:', !malformedResult.isValid ? 'PASSED' : 'FAILED');
  console.log('');

  // Test 4: Extraction d'utilisateur
  console.log('Test 4: User Extraction');
  const user = extractUserFromToken(validToken);
  console.log('Extracted user:', user);
  console.log('✅ User extraction test:', user !== null ? 'PASSED' : 'FAILED');
  console.log('');

  // Test 5: Vérification d'expiration proche
  console.log('Test 5: Expiration Check');
  const expiringSoon = isTokenExpiringSoon(validToken);
  console.log('Expiring soon:', expiringSoon);
  console.log('✅ Expiration check test:', !expiringSoon ? 'PASSED' : 'FAILED');
  console.log('');

  // Résumé
  const allTestsPassed = validResult.isValid && 
                        !expiredResult.isValid && 
                        !malformedResult.isValid && 
                        user !== null && 
                        !expiringSoon;

  console.log('📊 Test Summary:');
  console.log(`Valid token: ${validResult.isValid ? '✅' : '❌'}`);
  console.log(`Expired token: ${!expiredResult.isValid ? '✅' : '❌'}`);
  console.log(`Malformed token: ${!malformedResult.isValid ? '✅' : '❌'}`);
  console.log(`User extraction: ${user !== null ? '✅' : '❌'}`);
  console.log(`Expiration check: ${!expiringSoon ? '✅' : '❌'}`);
  console.log('');
  console.log(`Overall result: ${allTestsPassed ? '🎉 ALL TESTS PASSED!' : '⚠️ SOME TESTS FAILED!'}`);

  return allTestsPassed;
};

// Fonction pour tester avec des données personnalisées
export const testCustomJWT = (token: string) => {
  console.log('🧪 Testing Custom JWT Token...\n');
  console.log('Token:', token);
  
  const result = verifyJWT(token);
  console.log('Verification result:', result);
  
  if (result.isValid && result.payload) {
    console.log('Token payload:', result.payload);
    console.log('User ID:', result.payload.sub);
    console.log('Email:', result.payload.email);
    console.log('Expires at:', new Date(result.payload.exp * 1000).toLocaleString());
  }
  
  return result;
};

// Exposer les fonctions globalement pour les tests dans la console
if (typeof window !== 'undefined') {
  (window as any).testJWTImplementation = testJWTImplementation;
  (window as any).testCustomJWT = testCustomJWT;
  (window as any).verifyJWT = verifyJWT;
  (window as any).extractUserFromToken = extractUserFromToken;
  (window as any).isTokenExpiringSoon = isTokenExpiringSoon;
  
  console.log('🔧 JWT Test functions available in console:');
  console.log('- testJWTImplementation() - Run all JWT tests');
  console.log('- testCustomJWT(token) - Test a specific token');
  console.log('- verifyJWT(token) - Verify a JWT token');
  console.log('- extractUserFromToken(token) - Extract user from token');
  console.log('- isTokenExpiringSoon(token) - Check if token expires soon');
} 