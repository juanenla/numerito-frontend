/**
 * Barra de estado del juego
 */

interface StatusBarProps {
  gameId: string | null;
  attempts: number;
  finished: boolean;
  won: boolean;
}

export function StatusBar({ gameId, attempts, finished, won }: StatusBarProps) {
  if (!gameId) {
    return (
      <div className="status-bar">
        <p>👆 Presiona "Nueva Partida" para comenzar</p>
      </div>
    );
  }

  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="label">Intentos:</span>
        <span className="value">{attempts}</span>
      </div>
      <div className="status-item">
        <span className="label">Estado:</span>
        <span className={`value ${finished ? 'finished' : 'playing'}`}>
          {finished ? (won ? '🎉 ¡Victoria!' : 'Terminado') : '🎮 Jugando'}
        </span>
      </div>
    </div>
  );
}
