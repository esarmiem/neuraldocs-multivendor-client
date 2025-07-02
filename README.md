# NeuralDocs LLM Frontend

Frontend en Next.js para la aplicación NeuralDocs LLM que permite chatear con modelos de lenguaje de múltiples proveedores.

## Características

- 🎨 **Diseño Moderno**: Interfaz limpia con modo claro y colores personalizados
- 🔐 **Autenticación JWT**: Sistema de login profesional con persistencia de tokens
- 💬 **Chat en Tiempo Real**: Interfaz de chat fluida con el LLM
- 🧠 **Procesamiento Inteligente**: Oculta automáticamente las etiquetas de razonamiento del LLM
- 📊 **Estadísticas**: Muestra información sobre documentos y chunks en la base de datos
- 🗑️ **Gestión de Datos**: Opción para limpiar la base de datos vectorial

## Colores del Tema

- **Primario**: `#d91ba2` (Rosa/Magenta)
- **Secundario**: `#652678` (Púrpura)
- **Fondo**: Blanco
- **Texto**: Negro/Gris oscuro

## Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno (opcional):
   ```bash
   # Crear archivo .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
│   ├── chat/           # Página de chat
│   ├── login/          # Página de login
│   └── layout.tsx      # Layout principal
├── components/         # Componentes React
│   ├── AuthProvider.tsx
│   ├── ChatInterface.tsx
│   └── LoginForm.tsx
├── lib/               # Utilidades y configuración
│   └── api.ts         # Cliente de API
├── types/             # Tipos TypeScript
│   └── api.ts
└── utils/             # Utilidades
    └── textProcessing.ts
```

## API Endpoints Utilizados

- `POST /api/v1/auth/token` - Autenticación
- `POST /api/v1/chat/query` - Envío de mensajes al LLM
- `GET /api/v1/documents/database/stats` - Estadísticas de la BD
- `GET /api/v1/documents/list` - Lista de documentos
- `DELETE /api/v1/documents/database/clear` - Limpiar BD

## Funcionalidades Principales

### Autenticación
- Formulario de login con validación
- Persistencia de tokens en localStorage
- Redirección automática según estado de autenticación
- Manejo de errores de autenticación

### Chat Interface
- Interfaz de chat moderna y responsiva
- Indicadores de carga durante las respuestas
- Procesamiento automático de respuestas del LLM
- Ocultación de etiquetas de razonamiento (`<think>`, `<reasoning>`, etc.)

### Gestión de Documentos
- Visualización de estadísticas de la base de datos
- Opción para limpiar todos los documentos
- Información en tiempo real sobre documentos y chunks

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en modo producción
- `npm run lint` - Ejecutar linter

## Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **React Hooks** - Gestión de estado

## Configuración del Backend

Asegúrate de que tu backend FastAPI esté ejecutándose en `http://localhost:8000` y que tenga configurado CORS para permitir requests desde `http://localhost:3000`.

## Notas de Desarrollo

- El frontend está configurado para trabajar con el backend FastAPI existente
- Los tokens de autenticación se almacenan en localStorage
- Las respuestas del LLM se procesan automáticamente para ocultar etiquetas de razonamiento
- La interfaz es completamente responsiva y funciona en dispositivos móviles
