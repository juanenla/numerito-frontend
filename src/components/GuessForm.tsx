/**
 * Formulario para ingresar intentos
 */

import { useState, type FormEvent } from 'react';
import { validateGuess } from '../services/validation';

interface GuessFormProps {
  onSubmit: (guess: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export function GuessForm({ onSubmit, isLoading, disabled }: GuessFormProps) {
  const [guess, setGuess] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar el intento
    const validation = validateGuess(guess);
    if (!validation.valid) {
      setError(validation.error || 'Intento inválido');
      return;
    }

    // Enviar el intento
    onSubmit(guess);
    setGuess(''); // Limpiar el input
  };

  const handleInputChange = (value: string) => {
    // Solo permitir hasta 4 dígitos
    if (value.length <= 4) {
      setGuess(value);
      setError(null);
    }
  };

  return (
    <div className="guess-form">
      <form onSubmit={handleSubmit}>
        <div className="form-label">
          <label htmlFor="guess-input">
            Ingresá un número de 4 cifras distintas (la primera no puede ser 0)
          </label>
        </div>
        <div className="input-group">
          <input
            id="guess-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={guess}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="_ _ _ _"
            disabled={disabled || isLoading}
            className={error ? 'error' : ''}
            aria-label="Ingresa tu intento de 4 cifras"
            autoFocus
          />
          <button
            type="submit"
            className="btn-secondary"
            disabled={disabled || isLoading || guess.length !== 4}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Probando...
              </>
            ) : (
              '🎯 Probar'
            )}
          </button>
        </div>
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
