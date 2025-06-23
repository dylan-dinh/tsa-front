import jwt_decode from 'jwt-decode';

export interface JWTPayload {
  sub: string;
  email: string;
  username?: string;
  iat: number;
  exp: number;
}

export interface JWTVerificationResult {
  isValid: boolean;
  payload?: JWTPayload;
  error?: string;
}

/**
 * Vérifie si un token JWT est valide
 * @param token - Le token JWT à vérifier
 * @returns JWTVerificationResult avec le statut de validation
 */
export const verifyJWT = (token: string): JWTVerificationResult => {
  try {
    // Décoder le token pour vérifier sa structure
    const payload = jwt_decode<JWTPayload>(token);
    
    // Vérifier que le token a les champs requis
    if (!payload.sub || !payload.email || !payload.exp) {
      return {
        isValid: false,
        error: 'Invalid token structure'
      };
    }

    // Vérifier si le token a expiré
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      return {
        isValid: false,
        error: 'Token has expired'
      };
    }

    return {
      isValid: true,
      payload
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid token format'
    };
  }
};

/**
 * Extrait les informations utilisateur du token JWT
 * @param token - Le token JWT
 * @returns Les informations utilisateur ou null si invalide
 */
export const extractUserFromToken = (token: string): JWTPayload | null => {
  const result = verifyJWT(token);
  return result.isValid ? result.payload || null : null;
};

/**
 * Vérifie si un token va expirer bientôt (dans les 5 minutes)
 * @param token - Le token JWT
 * @returns true si le token expire bientôt
 */
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = jwt_decode<JWTPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60; // 5 minutes en secondes
    
    return (payload.exp - currentTime) < fiveMinutes;
  } catch {
    return true; // Si on ne peut pas décoder, considérer comme expiré
  }
}; 