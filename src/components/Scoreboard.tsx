/**
 * Componente que muestra el ranking de mejores scores
 */

import { useEffect, useState } from 'react';
import { getTopScores } from '../services/scoreApi';
import { ApiError } from '../services/gameApi';
import type { Score } from '../types/game';

interface ScoreboardProps {
  limit?: number;
  refreshTrigger?: number; // Cambiar este valor para forzar recarga
}

export function Scoreboard({ limit = 10, refreshTrigger = 0 }: ScoreboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScores();
  }, [limit, refreshTrigger]);

  const loadScores = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getTopScores(limit);
      setScores(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al cargar el ranking');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const getMedalEmoji = (position: number): string => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="scoreboard">
        <h3>🏆 Ranking de Mejores Scores</h3>
        <p className="scoreboard-subtitle">
          Los mejores {limit} jugadores ordenados por menor cantidad de intentos
        </p>
        <div className="skeleton-table">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="skeleton-row" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="skeleton skeleton-position"></div>
              <div className="skeleton skeleton-name"></div>
              <div className="skeleton skeleton-attempts"></div>
              <div className="skeleton skeleton-date"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scoreboard">
        <h3>🏆 Ranking de Mejores Scores</h3>
        <div className="error-message">{error}</div>
        <button className="btn-secondary" onClick={loadScores}>
          Reintentar
        </button>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="scoreboard">
        <h3>🏆 Ranking de Mejores Scores</h3>
        <div className="empty-state">
          <p>No hay scores guardados todavía.</p>
          <p>¡Sé el primero en aparecer en el ranking!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scoreboard">
      <h3>🏆 Ranking de Mejores Scores</h3>
      <p className="scoreboard-subtitle">
        Los mejores {limit} jugadores ordenados por menor cantidad de intentos
      </p>

      <div className="table-responsive">
        <table className="scoreboard-table">
          <thead>
            <tr>
              <th>Pos.</th>
              <th>Jugador</th>
              <th>Intentos</th>
              <th>Tiempo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.id} className={index < 3 ? 'top-three' : ''}>
                <td className="position">
                  {getMedalEmoji(index + 1)} {index + 1}
                </td>
                <td className="player-name">{score.playerName}</td>
                <td className="attempts">
                  <strong>{score.attempts}</strong>
                </td>
                <td className="time">
                  {score.timeSeconds ? (
                    <span>{Math.floor(score.timeSeconds / 60)}:{String(score.timeSeconds % 60).padStart(2, '0')}</span>
                  ) : '-'}
                </td>
                <td className="date">{formatDate(score.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn-secondary refresh-btn" onClick={loadScores}>
        🔄 Actualizar
      </button>
    </div>
  );
}
