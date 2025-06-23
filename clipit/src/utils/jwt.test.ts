import { verifyJWT, extractUserFromToken, isTokenExpiringSoon, JWTPayload } from './jwt';

// Tests simples pour les fonctions JWT
export const runJWTTests = () => {
  console.log('🧪 Running JWT Tests...\n');

  const mockValidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const mockExpiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjF9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  let testsPassed = 0;
  let totalTests = 0;

  const assert = (condition: boolean, testName: string) => {
    totalTests++;
    if (condition) {
      testsPassed++;
      console.log(`✅ ${testName}`);
    } else {
      console.log(`❌ ${testName}`);
    }
  };

  // Test 1: Vérifier un token valide
  const validResult = verifyJWT(mockValidToken);
  assert(validResult.isValid, 'Valid JWT should be accepted');
  assert(validResult.payload !== undefined, 'Valid JWT should have payload');

  // Test 2: Vérifier un token expiré
  const expiredResult = verifyJWT(mockExpiredToken);
  assert(!expiredResult.isValid, 'Expired JWT should be rejected');
  assert(expiredResult.error !== undefined, 'Expired JWT should have error message');

  // Test 3: Vérifier un token malformé
  const malformedResult = verifyJWT('invalid.token.here');
  assert(!malformedResult.isValid, 'Malformed JWT should be rejected');
  assert(malformedResult.error !== undefined, 'Malformed JWT should have error message');

  // Test 4: Vérifier une chaîne vide
  const emptyResult = verifyJWT('');
  assert(!emptyResult.isValid, 'Empty string should be rejected');
  assert(emptyResult.error !== undefined, 'Empty string should have error message');

  // Test 5: Extraire les informations utilisateur d'un token valide
  const user = extractUserFromToken(mockValidToken);
  assert(user !== null, 'User should be extracted from valid token');
  assert(user?.sub === '1234567890', 'User sub should match');

  // Test 6: Extraire les informations d'un token invalide
  const invalidUser = extractUserFromToken('invalid.token');
  assert(invalidUser === null, 'Invalid token should return null user');

  // Test 7: Vérifier si un token expire bientôt (token valide)
  const notExpiringSoon = isTokenExpiringSoon(mockValidToken);
  assert(!notExpiringSoon, 'Valid token should not be expiring soon');

  // Test 8: Vérifier si un token expire bientôt (token expiré)
  const expiringSoon = isTokenExpiringSoon(mockExpiredToken);
  assert(expiringSoon, 'Expired token should be expiring soon');

  console.log(`\n📊 Test Results: ${testsPassed}/${totalTests} tests passed`);
  
  if (testsPassed === totalTests) {
    console.log('🎉 All JWT tests passed!');
  } else {
    console.log('⚠️  Some JWT tests failed!');
  }

  return testsPassed === totalTests;
};

// Fonction utilitaire pour créer des tokens de test
export const createTestToken = (payload: Partial<JWTPayload>): string => {
  const defaultPayload: JWTPayload = {
    sub: 'test-user-id',
    email: 'test@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // Expire dans 1 heure
    ...payload
  };

  // Note: Ceci est un exemple simplifié. En production, vous utiliseriez une vraie signature JWT
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadStr = btoa(JSON.stringify(defaultPayload));
  const signature = 'test-signature';

  return `${header}.${payloadStr}.${signature}`;
};

// Fonction pour tester avec un token personnalisé
export const testCustomToken = (customPayload: Partial<JWTPayload>) => {
  console.log('🧪 Testing custom token...\n');
  
  const customToken = createTestToken(customPayload);
  const result = verifyJWT(customToken);
  
  console.log('Custom token payload:', customPayload);
  console.log('Verification result:', result);
  
  return result.isValid;
};

// Exemple d'utilisation
if (typeof window !== 'undefined') {
  // Exécuter les tests dans le navigateur
  (window as any).runJWTTests = runJWTTests;
  (window as any).testCustomToken = testCustomToken;
} 