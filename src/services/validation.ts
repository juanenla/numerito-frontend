/**
 * Validaciones del juego Numerito
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valida que un intento cumpla las reglas del juego
 */
export function validateGuess(guess: string): ValidationResult {
  // Verificar que no esté vacío
  if (!guess || guess.trim() === '') {
    return {
      valid: false,
      error: 'Debes ingresar un número',
    };
  }

  // Verificar que tenga exactamente 4 caracteres
  if (guess.length !== 4) {
    return {
      valid: false,
      error: 'El número debe tener exactamente 4 cifras',
    };
  }

  // Verificar que todos sean dígitos
  if (!/^\d{4}$/.test(guess)) {
    return {
      valid: false,
      error: 'Solo puedes usar números (0-9)',
    };
  }

  // Verificar que no empiece con 0
  if (guess[0] === '0') {
    return {
      valid: false,
      error: 'El primer número no puede ser 0',
    };
  }

  // Verificar que todas las cifras sean distintas
  const digits = new Set(guess.split(''));
  if (digits.size !== 4) {
    return {
      valid: false,
      error: 'Todas las cifras deben ser distintas',
    };
  }

  return { valid: true };
}
