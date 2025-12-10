/**
 * Componente de cabecera del juego
 */

interface GameHeaderProps {
  onNewGame: () => void;
  isLoading: boolean;
}

export function GameHeader({ onNewGame, isLoading }: GameHeaderProps) {
  return (
    <header className="game-header">
      <h1>🎮 Numerito</h1>
      <p className="subtitle">Adivina el número de 4 cifras distintas</p>
      <button
        className="btn-primary"
        onClick={onNewGame}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Creando partida...
          </>
        ) : (
          '✨ Nueva Partida'
        )}
      </button>
    </header>
  );
}
