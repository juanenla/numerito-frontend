/**
 * Hook personalizado para manejar el estado del juego Numerito
 */

import { useState, useEffect, useCallback } from 'react';
import { createGame, makeGuess, getGameStatus, ApiError } from '../services/gameApi';
import type { AttemptHistory } from '../types/game';

// Key para localStorage
const GAME_ID_STORAGE_KEY = 'numerito_game_id';

interface GameState {
  gameId: string | null;
  attempts: AttemptHistory[];
  finished: boolean;
  won: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseGameReturn extends GameState {
  startNewGame: () => Promise<void>;
  submitGuess: (guess: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Hook que maneja todo el estado y lógica del juego
 */
export function useGame(): UseGameReturn {
  const [gameId, setGameId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<AttemptHistory[]>([]);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Guarda el gameId en localStorage
   */
  const saveGameIdToStorage = useCallback((id: string) => {
    try {
      localStorage.setItem(GAME_ID_STORAGE_KEY, id);
    } catch (err) {
      console.error('Error saving gameId to localStorage:', err);
    }
  }, []);

  /**
   * Elimina el gameId de localStorage
   */
  const clearGameIdFromStorage = useCallback(() => {
    try {
      localStorage.removeItem(GAME_ID_STORAGE_KEY);
    } catch (err) {
      console.error('Error removing gameId from localStorage:', err);
    }
  }, []);

  /**
   * Restaura la partida desde el gameId guardado
   */
  const restoreGame = useCallback(async (storedGameId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await getGameStatus(storedGameId);

      // La partida existe, restaurar el gameId
      setGameId(storedGameId);
      setFinished(status.finished);

      // Nota: No tenemos el historial completo, solo el número de intentos
      // El usuario tendrá que seguir jugando desde aquí

      console.log('Partida restaurada:', storedGameId);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) {
        // La partida ya no existe, limpiar localStorage
        clearGameIdFromStorage();
        console.log('Partida no encontrada, limpiando localStorage');
      } else {
        setError('No se pudo conectar con el servidor');
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearGameIdFromStorage]);

  /**
   * Intenta restaurar la partida al montar el componente
   */
  useEffect(() => {
    const storedGameId = localStorage.getItem(GAME_ID_STORAGE_KEY);

    if (storedGameId) {
      restoreGame(storedGameId);
    }
  }, [restoreGame]);

  /**
   * Inicia una nueva partida
   */
  const startNewGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createGame();

      // Reiniciar todo el estado
      setGameId(response.gameId);
      setAttempts([]);
      setFinished(false);
      setWon(false);

      // Guardar en localStorage
      saveGameIdToStorage(response.gameId);

      console.log('Nueva partida creada:', response.gameId);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 0) {
          setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
        } else {
          setError(err.message);
        }
      } else {
        setError('Error al crear la partida');
      }
    } finally {
      setIsLoading(false);
    }
  }, [saveGameIdToStorage]);

  /**
   * Envía un intento al backend
   */
  const submitGuess = useCallback(async (guess: string) => {
    if (!gameId) {
      setError('No hay una partida activa');
      return;
    }

    if (finished) {
      setError('La partida ya terminó');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await makeGuess(gameId, guess);

      // Agregar al historial
      const newAttempt: AttemptHistory = {
        ...response,
        guess,
      };

      setAttempts((prev) => [...prev, newAttempt]);

      // Actualizar estado del juego
      if (response.finished) {
        setFinished(true);
        if (response.win) {
          setWon(true);
          // Limpiar localStorage al ganar
          clearGameIdFromStorage();
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.statusCode) {
          case 400:
            // Error de validación
            setError(err.message);
            break;
          case 404:
            // Partida no encontrada
            setError('La partida no existe. Crea una nueva partida.');
            clearGameIdFromStorage();
            setGameId(null);
            break;
          case 0:
            // Error de red
            setError('No se pudo conectar con el servidor');
            break;
          default:
            setError('Error al procesar el intento');
        }
      } else {
        setError('Error inesperado');
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameId, finished, clearGameIdFromStorage]);

  return {
    gameId,
    attempts,
    finished,
    won,
    isLoading,
    error,
    startNewGame,
    submitGuess,
    clearError,
  };
}
