# Numerito Frontend

Frontend del juego "Numerito" - Adivina el número de 4 cifras distintas.

## Tecnologías

- **Vite** 6.x - Build tool
- **React** 18.x - UI library
- **TypeScript** 5.x - Type safety
- **CSS** - Styling (sin librerías externas por ahora)

## Requisitos

- Node.js 18+
- npm 9+ (o pnpm/yarn)
- **Backend API corriendo en `http://localhost:8080`**

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Preview del build de producción

# Linting
npm run lint         # Ejecuta ESLint
```

## Estructura del Proyecto

```
numerito-frontend/
├── src/
│   ├── components/
│   │   ├── GameHeader.tsx        # Cabecera con botón nueva partida
│   │   ├── GuessForm.tsx         # Formulario para ingresar intentos
│   │   ├── GuessHistory.tsx      # Historial de intentos
│   │   └── StatusBar.tsx         # Barra de estado (intentos, estado)
│   ├── services/
│   │   ├── gameApi.ts            # Servicio para consumir API REST
│   │   └── validation.ts         # Validaciones de frontend
│   ├── types/
│   │   └── game.ts               # Tipos e interfaces TypeScript
│   ├── config.ts                 # Configuración (URL de API)
│   ├── App.tsx                   # Componente principal
│   ├── App.css                   # Estilos del juego
│   ├── index.css                 # Estilos globales
│   └── main.tsx                  # Punto de entrada
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Configuración de la API

La URL base de la API se configura en `src/config.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

Puedes sobrescribirla creando un archivo `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Despliegue en Vercel

Para que la aplicación funcione correctamente en Vercel, debes configurar la siguiente variable de entorno en el panel de Vercel (Settings -> Environment Variables):

- **Key**: `VITE_API_BASE_URL`
- **Value**: La URL de tu backend en Render + `/api` (ejemplo: `https://numerito-backend.onrender.com/api`)


## Endpoints de la API

El frontend consume estos endpoints del backend:

### POST `/api/game`
Crea una nueva partida.

**Respuesta:**
```json
{
  "gameId": "uuid-generado",
  "message": "Partida creada exitosamente"
}
```

### POST `/api/game/{gameId}/guess`
Realiza un intento.

**Request:**
```json
{
  "guess": "1234"
}
```

**Respuesta:**
```json
{
  "bien": 1,
  "regular": 2,
  "mal": 1,
  "win": false,
  "attemptNumber": 3,
  "finished": false
}
```

**Respuesta de error (400):**
```json
{
  "error": "INVALID_GUESS",
  "message": "Todas las cifras deben ser distintas",
  "timestamp": "2024-12-05T10:30:45.123"
}
```

### GET `/api/game/{gameId}`
Consulta el estado de una partida.

**Respuesta:**
```json
{
  "gameId": "uuid",
  "attempts": 5,
  "finished": false
}
```

## Validaciones del Frontend

Antes de enviar un intento a la API, se valida:

- ✅ Exactamente 4 dígitos
- ✅ Primer dígito entre 1-9 (no puede ser 0)
- ✅ Solo caracteres numéricos
- ✅ Todas las cifras distintas entre sí

Ejemplos de intentos inválidos:
- `"0123"` - Empieza con 0
- `"1122"` - Dígitos repetidos
- `"123"` - Menos de 4 dígitos
- `"12345"` - Más de 4 dígitos
- `"12a4"` - Caracteres no numéricos

## Flujo de Juego

1. El jugador presiona "Nueva Partida"
2. Se llama a `POST /api/game` y se obtiene un `gameId`
3. El jugador ingresa un número de 4 cifras
4. Se valida en frontend
5. Si es válido, se envía a `POST /api/game/{gameId}/guess`
6. Se muestra el resultado (B, R, M) en el historial
7. Si `win === true`, se muestra mensaje de victoria
8. El jugador puede seguir intentando o iniciar una nueva partida

## Características

- 🎮 Interfaz simple e intuitiva
- 📱 Diseño responsivo (mobile-friendly)
- ⚡ Validación en tiempo real
- 📋 Historial de intentos con colores
- 🎉 Animaciones y feedback visual
- 🚫 Manejo de errores de la API
- 🔄 Estado de carga durante peticiones

## Desarrollo

### Estructura de Componentes

- **App**: Componente principal que maneja el estado global del juego
- **GameHeader**: Cabecera con título y botón de nueva partida
- **StatusBar**: Muestra intentos realizados y estado de la partida
- **GuessForm**: Input + botón para ingresar intentos
- **GuessHistory**: Tabla con historial de intentos y resultados

### Estado del Juego

```typescript
{
  gameId: string | null,           // ID de la partida actual
  attempts: AttemptHistory[],      // Historial de intentos
  finished: boolean,               // Si la partida terminó
  won: boolean,                    // Si el jugador ganó
  isLoading: boolean,              // Estado de carga
  error: string | null             // Mensaje de error
}
```

## Próximos Pasos

- 🔄 Conectar con Supabase para persistencia
- 🎨 Mejorar diseño visual (Prompt 6/8)
- 🏆 Sistema de puntuación y ranking
- 👤 Autenticación de usuarios
- 📊 Estadísticas de partidas

## Troubleshooting

### Error: No se pudo conectar con el servidor

Asegúrate de que el backend esté corriendo:

```bash
cd ../numerito-game
mvn spring-boot:run
```

El backend debe estar disponible en `http://localhost:8080`

### Error: CORS

Si ves errores de CORS, verifica que el backend tenga configurado el origen correcto en `CorsConfig.java`:

```java
config.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",  // Vite dev server
    "http://localhost:3000"   // Alternativa
));
```

## Licencia

Proyecto educacional para el curso de IA APP.
