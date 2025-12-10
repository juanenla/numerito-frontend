/**
 * Formulario para guardar el score cuando el jugador gana
 */

import { useState, type FormEvent } from 'react';
import { saveScore } from '../services/scoreApi';
import { ApiError } from '../services/gameApi';

interface SaveScoreFormProps {
  attempts: number;
  gameId: string | null;
  onScoreSaved?: () => void;
}

export function SaveScoreForm({ attempts, gameId, onScoreSaved }: SaveScoreFormProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      // Guardar el score
      await saveScore({
        playerName: playerName.trim() || 'Anónimo',
        attempts,
        gameId: gameId || undefined,
      });

      setSaved(true);

      // Notificar al padre que se guardó el score
      if (onScoreSaved) {
        onScoreSaved();
      }

      console.log('Score guardado exitosamente');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al guardar el score');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="save-score-form saved">
        <p className="success-message">
          ✅ ¡Score guardado exitosamente! Mira el ranking abajo.
        </p>
      </div>
    );
  }

  return (
    <div className="save-score-form">
      <h3>💾 Guardar tu Score</h3>
      <p className="form-description">
        ¡Lograste adivinar el número en <strong>{attempts}</strong> intentos!
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playerName">Tu nombre (opcional):</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ingresa tu nombre o deja en blanco"
            maxLength={50}
            disabled={isSaving}
          />
          <small className="form-hint">
            Si no ingresas nombre, se guardará como "Anónimo"
          </small>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar en Ranking'}
        </button>
      </form>
    </div>
  );
}
