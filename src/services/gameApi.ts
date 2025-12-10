/**
 * Servicio para interactuar con la API del juego Numerito
 */

import { API_BASE_URL } from '../config';
import type {
  GameCreatedResponse,
  GuessResponse,
  GameStatusResponse,
  ErrorResponse
} from '../types/game';

/**
 * Clase de error personalizada para errores de la API
 */
export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;

  constructor(
    message: string,
    statusCode: number,
    errorCode?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

/**
 * Manejo genérico de respuestas de la API
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ErrorResponse | null = null;

    try {
      errorData = await response.json();
    } catch {
      // Si no se puede parsear el JSON, usar mensaje genérico
    }

    throw new ApiError(
      errorData?.message || 'Error en la petición a la API',
      response.status,
      errorData?.error
    );
  }

  return response.json();
}

/**
 * Crea una nueva partida
 * POST /api/game
 */
export async function createGame(): Promise<GameCreatedResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<GameCreatedResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }
}

/**
 * Realiza un intento en la partida
 * POST /api/game/{gameId}/guess
 */
export async function makeGuess(
  gameId: string,
  guess: string
): Promise<GuessResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/game/${gameId}/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ guess }),
    });

    return handleResponse<GuessResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }
}

/**
 * Consulta el estado de una partida
 * GET /api/game/{gameId}
 */
export async function getGameStatus(
  gameId: string
): Promise<GameStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/game/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<GameStatusResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }
}
