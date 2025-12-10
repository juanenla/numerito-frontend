/**
 * Servicio para interactuar con la API de scores
 */

import { API_BASE_URL } from '../config';
import type { Score, SaveScoreRequest } from '../types/game';
import { ApiError } from './gameApi';

/**
 * Guarda un nuevo score en el backend
 * POST /api/scores
 */
export async function saveScore(request: SaveScoreRequest): Promise<Score> {
  try {
    const response = await fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch {
        // Si no se puede parsear el JSON, usar mensaje genérico
      }

      throw new ApiError(
        errorData?.message || 'Error al guardar el score',
        response.status,
        errorData?.error
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }
}

/**
 * Obtiene los mejores N scores del ranking
 * GET /api/scores/top?limit=N
 */
export async function getTopScores(limit: number = 10): Promise<Score[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/scores/top?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch {
        // Si no se puede parsear el JSON, usar mensaje genérico
      }

      throw new ApiError(
        errorData?.message || 'Error al obtener los scores',
        response.status,
        errorData?.error
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }
}
