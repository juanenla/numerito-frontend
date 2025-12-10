/**
 * Tipos y interfaces para el juego Numerito
 */

/**
 * Respuesta al crear una nueva partida
 */
export interface GameCreatedResponse {
  gameId: string;
  message: string;
}

/**
 * Respuesta al hacer un intento
 */
export interface GuessResponse {
  bien: number;      // Cifras correctas en posición correcta
  regular: number;   // Cifras correctas en posición incorrecta
  mal: number;       // Cifras que no están en el número
  win: boolean;      // true si el jugador ganó
  attemptNumber: number;  // Número del intento actual
  finished: boolean; // true si la partida terminó
}

/**
 * Respuesta al consultar estado de partida
 */
export interface GameStatusResponse {
  gameId: string;
  attempts: number;
  finished: boolean;
}

/**
 * Respuesta de error de la API
 */
export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}

/**
 * Intento del jugador (para el historial)
 */
export interface AttemptHistory extends GuessResponse {
  guess: string;  // El número que se intentó
}

/**
 * Score/puntuación de una partida
 */
export interface Score {
  id: string;
  playerName: string;
  attempts: number;
  createdAt: string;  // ISO 8601 timestamp
  gameId?: string;
}

/**
 * Request para guardar un score
 */
export interface SaveScoreRequest {
  playerName: string;
  attempts: number;
  gameId?: string;
}
