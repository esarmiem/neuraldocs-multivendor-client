# Instrucciones de Uso - NeuralDocs LLM Frontend

## 🚀 Inicio Rápido

### 1. Preparación del Backend
Antes de usar el frontend, asegúrate de que tu backend FastAPI esté ejecutándose:

```bash
# En el directorio raíz del proyecto
cd /Users/alaskatech/Documents/dev/backend/neuraldocs-multivendor-llm

# Activar el entorno virtual
source venv/bin/activate

# Ejecutar el backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Ejecutar el Frontend
En una nueva terminal, navega al directorio del frontend:

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: http://localhost:3000

## 🔐 Autenticación

### Credenciales por Defecto
El sistema utiliza las credenciales por defecto del backend:
- **Usuario**: `testuser`
- **Contraseña**: `testpassword`

### Flujo de Autenticación
1. Al acceder a la aplicación, serás redirigido automáticamente a la página de login
2. Ingresa tus credenciales
3. El token JWT se almacenará automáticamente en localStorage
4. Serás redirigido al chat principal

## 💬 Uso del Chat

### Enviar Mensajes
1. Escribe tu pregunta en el campo de texto en la parte inferior
2. Presiona "Enviar" o Enter
3. El sistema procesará tu pregunta y mostrará la respuesta del LLM

### Características del Chat
- **Procesamiento Inteligente**: Las etiquetas de razonamiento (`<think>`, `<reasoning>`, etc.) se ocultan automáticamente
- **Historial**: Todas las conversaciones se mantienen durante la sesión
- **Indicadores de Carga**: Animaciones que muestran cuando el sistema está procesando
- **Timestamps**: Cada mensaje muestra la hora de envío

### Ejemplo de Uso
```
Usuario: "¿Qué sabes sobre Elder y sobre VeciApp?"

Sistema: [Procesa la pregunta y oculta automáticamente las etiquetas de razonamiento]
Respuesta: "Elder Rafael Sarmiento Martínez es un profesional con experiencia en desarrollado de software y analista de IT, residente en Medellín, Colombia."
```

## 📊 Gestión de Documentos

### Estadísticas
En la parte superior del chat verás información sobre:
- Número total de documentos en la base de datos
- Número total de chunks procesados

### Limpiar Base de Datos
- Usa el botón "Limpiar DB" para eliminar todos los documentos
- Esta acción requiere confirmación
- **⚠️ Advertencia**: Esta acción no se puede deshacer

## 🎨 Personalización

### Colores del Tema
El frontend utiliza los colores especificados:
- **Primario**: `#d91ba2` (Rosa/Magenta)
- **Secundario**: `#652678` (Púrpura)
- **Fondo**: Blanco
- **Texto**: Negro/Gris oscuro

### Modo de Diseño
- Interfaz completamente en modo claro
- Diseño responsivo que funciona en móviles y desktop
- Iconos de Lucide React para una experiencia visual moderna

## 🔧 Configuración Avanzada

### Variables de Entorno
Puedes configurar la URL del backend creando un archivo `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Scripts Disponibles
```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar en modo producción
npm run lint         # Ejecutar linter
npm run type-check   # Verificar tipos TypeScript
```

## 🐛 Solución de Problemas

### Error de Conexión
Si ves errores de conexión:
1. Verifica que el backend esté ejecutándose en el puerto 8000
2. Revisa que CORS esté configurado correctamente en el backend
3. Verifica la URL en la configuración del frontend

### Error de Autenticación
Si tienes problemas de login:
1. Verifica las credenciales
2. Asegúrate de que el backend tenga usuarios configurados
3. Revisa la consola del navegador para errores específicos

### Problemas de CORS
Si hay errores de CORS, asegúrate de que el backend tenga configurado:

```python
# En app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome (recomendado)
- Firefox
- Safari
- Edge

### Dispositivos
- Desktop (Windows, macOS, Linux)
- Tablet
- Móvil (iOS, Android)

## 🔒 Seguridad

### Almacenamiento de Tokens
- Los tokens JWT se almacenan en localStorage
- Se eliminan automáticamente al cerrar sesión
- Se eliminan si hay errores de autenticación

### Validación
- Todas las entradas se validan en el frontend
- Las respuestas del backend se procesan de forma segura
- No se ejecuta código HTML en las respuestas del LLM

## 📈 Rendimiento

### Optimizaciones
- Lazy loading de componentes
- Optimización de imágenes con Next.js
- Código splitting automático
- Caché de respuestas del navegador

### Monitoreo
- Errores se registran en la consola del navegador
- Indicadores de carga para operaciones largas
- Timeouts automáticos para requests fallidos 