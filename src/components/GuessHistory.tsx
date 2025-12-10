/**
 * Historial de intentos del jugador
 */

import type { AttemptHistory } from '../types/game';

interface GuessHistoryProps {
  attempts: AttemptHistory[];
}

export function GuessHistory({ attempts }: GuessHistoryProps) {
  if (attempts.length === 0) {
    return (
      <div className="guess-history empty">
        <p>Aún no hay intentos. ¡Haz tu primera jugada!</p>
      </div>
    );
  }

  return (
    <div className="guess-history">
      <h3>📋 Historial de Intentos</h3>
      <div className="attempts-list">
        {attempts.map((attempt, index) => (
          <div
            key={attempt.attemptNumber}
            className={`attempt-card ${attempt.win ? 'win' : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="attempt-number">#{attempt.attemptNumber}</div>
            <div className="attempt-guess">{attempt.guess}</div>
            <div className="attempt-results">
              {attempt.bien > 0 && (
                <span className="result-badge bien">
                  <span className="badge-icon">✓</span>
                  <span className="badge-label">Bien</span>
                  <span className="badge-count">{attempt.bien}</span>
                </span>
              )}
              {attempt.regular > 0 && (
                <span className="result-badge regular">
                  <span className="badge-icon">↔</span>
                  <span className="badge-label">Regular</span>
                  <span className="badge-count">{attempt.regular}</span>
                </span>
              )}
              {attempt.mal > 0 && (
                <span className="result-badge mal">
                  <span className="badge-icon">✗</span>
                  <span className="badge-label">Mal</span>
                  <span className="badge-count">{attempt.mal}</span>
                </span>
              )}
              {attempt.bien === 0 && attempt.regular === 0 && attempt.mal === 0 && (
                <span className="result-empty">Sin resultados</span>
              )}
            </div>
            {attempt.win && (
              <div className="attempt-status">
                <span className="status-badge win">🎉 ¡Ganaste!</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
