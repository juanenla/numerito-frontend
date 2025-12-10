/**
 * Componente principal de la aplicación Numerito
 */

import { useState } from 'react';
import { GameHeader } from './components/GameHeader';
import { GuessForm } from './components/GuessForm';
import { GuessHistory } from './components/GuessHistory';
import { StatusBar } from './components/StatusBar';
import { SaveScoreForm } from './components/SaveScoreForm';
import { Scoreboard } from './components/Scoreboard';
import { GameTimer } from './components/GameTimer';
import { DraftBoard } from './components/DraftBoard';
import { useGame } from './hooks/useGame';
import './App.css';

function App() {
  // Hook personalizado que maneja todo el estado del juego
  const {
    gameId,
    attempts,
    finished,
    won,
    isLoading,
    error,
    startNewGame,
    submitGuess,
    clearError,
    startTime,
    endTime,
  } = useGame();

  // Estado para refrescar el scoreboard cuando se guarda un score
  const [scoreboardRefresh, setScoreboardRefresh] = useState(0);

  const handleScoreSaved = () => {
    // Incrementar el contador para forzar recarga del scoreboard
    setScoreboardRefresh((prev) => prev + 1);
  };

  return (
    <div className="app">
      <div className="container">
        <GameHeader onNewGame={startNewGame} isLoading={isLoading} />

        <StatusBar
          gameId={gameId}
          attempts={attempts.length}
          finished={finished}
          won={won}
        />

        {error && (
          <div className="alert error">
            <button
              className="alert-close"
              onClick={clearError}
              aria-label="Cerrar alerta"
            >
              ×
            </button>
            <strong>Error:</strong> {error}
          </div>
        )}

        {won && (
          <div className="alert success">
            <h2>🎉 ¡Felicitaciones!</h2>
            <p>¡Adivinaste el número en {attempts.length} intentos!</p>
            <GameTimer startTime={startTime} endTime={endTime} />
            <SaveScoreForm
              attempts={attempts.length}
              gameId={gameId}
              timeSeconds={endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0}
              onScoreSaved={handleScoreSaved}
            />
            <button className="btn-primary" onClick={startNewGame}>
              Jugar de Nuevo
            </button>
          </div>
        )}

        {finished && !won && (
          <div className="alert info">
            <p>
              La partida terminó. Presiona "Nueva Partida" para seguir jugando.
            </p>
          </div>
        )}

        {gameId && !finished && (
          <>
            <DraftBoard />
            <GameTimer startTime={startTime} endTime={null} />
            <GuessForm
              onSubmit={submitGuess}
              isLoading={isLoading}
              disabled={finished}
            />
          </>
        )}

        {attempts.length > 0 && <GuessHistory attempts={attempts} />}

        {!gameId && !isLoading && (
          <div className="welcome">
            <p className="welcome-text">
              👆 Presiona <strong>"Nueva Partida"</strong> para comenzar a jugar
            </p>
          </div>
        )}

        <div className="rules">
          <h4>📖 Reglas del Juego</h4>
          <ul>
            <li>
              <strong>B (Bien):</strong> Cifra correcta en posición correcta
            </li>
            <li>
              <strong>R (Regular):</strong> Cifra correcta pero en otra posición
            </li>
            <li>
              <strong>M (Mal):</strong> Cifra que no está en el número
            </li>
          </ul>
          <p className="hint">
            💡 El número tiene 4 cifras distintas y no empieza con 0
          </p>
        </div>

        {/* Scoreboard - Ranking de mejores scores */}
        <Scoreboard limit={10} refreshTrigger={scoreboardRefresh} />
      </div>
    </div>
  );
}

export default App;

