# PokéDex Manager

Aplicación web completa para gestionar una colección personal de Pokémon. Permite explorar el catálogo completo de Pokémon mediante la integración con PokeAPI, guardar favoritos en una colección privada y añadir notas personalizadas a cada Pokémon.

## Arquitectura del Proyecto

El proyecto utiliza una arquitectura monorepo con dos aplicaciones independientes que se comunican mediante API REST.

### Backend
- Framework: Express 5.2.1
- Lenguaje: TypeScript 5.9.3
- ORM: Prisma 6.19.2
- Base de datos: SQLite
- Autenticación: JWT con cookies HttpOnly
- Validación: Zod 4.3.6
- Encriptación: bcryptjs 3.0.3

### Frontend
- Framework: React 19.2.0
- Build tool: Vite 7.2.4
- Lenguaje: TypeScript 5.9.3
- Routing: React Router DOM 7.13.0
- Estilos: Tailwind CSS 3.4.19
- Estado: Context API de React

## Estructura de Directorios

```
apps/
├── api/
│   ├── prisma/
│   │   └── schema.prisma        # Esquema de base de datos
│   └── src/
│       ├── index.ts             # Punto de entrada del servidor
│       ├── lib/                 # JWT y utilidades
│       ├── middleware/          # Autenticación y validación
│       ├── repositories/        # Capa de acceso a datos
│       ├── routes/              # Definición de endpoints
│       └── services/            # Lógica de negocio
└── web/
    └── src/
        ├── main.tsx             # Punto de entrada de React
        ├── App.tsx              # Configuración de rutas
        ├── components/          # Componentes reutilizables
        ├── pages/               # Vistas principales
        ├── hooks/               # Custom hooks
        ├── services/            # Cliente API
        ├── store/               # Context de autenticación
        └── types/               # Definiciones TypeScript
```

## Modelo de Datos

### User
- id: Identificador único autoincremental
- email: Correo electrónico único del usuario
- password: Contraseña hasheada con bcrypt
- collection: Relación uno a muchos con CollectionItem

### CollectionItem
- id: Identificador único autoincremental
- pokemonId: ID del Pokémon en PokeAPI
- name: Nombre del Pokémon
- spriteUrl: URL de la imagen oficial
- note: Nota opcional del usuario
- userId: Relación con User
- user: Relación many-to-one con User, onDelete Cascade

## API Endpoints

### Autenticación
POST /api/auth/register
- Body: { email: string, password: string }
- Retorna: Usuario creado y token JWT en cookie

POST /api/auth/login
- Body: { email: string, password: string }
- Retorna: Usuario autenticado y token JWT en cookie

POST /api/auth/logout
- Requiere: Cookie de autenticación
- Retorna: Confirmación de cierre de sesión

### Usuario
GET /api/user/me
- Requiere: Cookie de autenticación
- Retorna: Datos del usuario actual

### Colección
GET /api/collection
- Requiere: Cookie de autenticación
- Retorna: Lista completa de Pokémon guardados

POST /api/collection
- Requiere: Cookie de autenticación
- Body: { pokemonId: number, name: string, spriteUrl: string, note?: string }
- Retorna: Item creado en la colección

DELETE /api/collection/:id
- Requiere: Cookie de autenticación
- Retorna: Confirmación de eliminación

## Rutas Frontend

### Públicas
- / : Listado completo de Pokémon con buscador y paginación
- /pokemon/:id : Vista detallada de un Pokémon específico
- /login : Formulario de inicio de sesión
- /register : Formulario de registro

### Protegidas
- /collection : Colección personal del usuario autenticado

## Componentes Principales

### Layout
Contenedor global con gradiente de fondo navy y navbar persistente en todas las páginas.

### Navbar
Barra de navegación superior con logo de Pokéball, enlaces principales y menú desplegable de usuario cuando está autenticado. Muestra email del usuario y opción de logout.

### PokemonCard
Tarjeta de Pokémon con imagen oficial, nombre, ID y botón para añadir a colección. Si el usuario no está logueado, abre modal de autenticación. Navegación al detalle mediante click en la tarjeta.

### Card
Contenedor reutilizable con fondo cream, bordes redondeados y sombra. Usado en formularios y contenido general.

### Button
Botón con tres variantes: primary rojo, secondary naranja y danger rojo oscuro. Estilos consistentes sin animaciones agresivas.

### Input
Campo de entrada con borde cream oscuro, focus ring naranja y soporte para labels y mensajes de error.

### ProtectedRoute
Higher-order component que verifica autenticación. Redirige a login si el usuario no está autenticado.

## Páginas

### PokemonListPage
Página principal. Muestra grid de Pokémon con paginación de 20 items. Header con logo de Pokéballs animadas, título colorido y buscador minimalista. Filtrado en tiempo real por nombre.

### PokemonDetailPage
Vista individual de Pokémon. Dos columnas: imagen grande del artwork oficial y detalles como tipos, altura, peso. Formulario para añadir a colección con nota opcional. Modal de autenticación integrado si no hay sesión.

### CollectionPage
Vista privada de la colección personal. Grid de Pokémon guardados con notas visibles. Opción de eliminar items. Mensaje cuando la colección está vacía con link para explorar.

### LoginPage y RegisterPage
Formularios de autenticación con Card centrado. Validación de email y password. Mensajes de error claros. Links cruzados entre login y registro.

## Sistema de Colores

Paleta inspirada en Pokédex clásica:
- Navy: #1e3a5f - Fondo principal
- Navy Dark: #162d4a - Navbar y secciones destacadas
- Cream: #f5e6d3 - Cards y contenedores
- Cream Dark: #e8d5bc - Bordes y detalles
- Orange: #FF6B35 - Acentos y focus states
- Red: #EE1515 - Botones primary y texto Dex
- Yellow: #FFCB05 - Texto Poké
- Blue: #3B4CCA - Detalles secundarios

## Instalación

### Requisitos
- Node.js 18 o superior
- npm o yarn

### Backend
```bash
cd apps/api
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

El servidor inicia en puerto 3000.

### Frontend
```bash
cd apps/web
npm install
npm run dev
```

La aplicación inicia en puerto 5173.

## Configuración

### Variables de Entorno Backend
Crear archivo .env en apps/api:
```
JWT_SECRET=tu_secret_key_aqui
PORT=3000
```

### Base de Datos
El archivo dev.db de SQLite se crea automáticamente en apps/api/prisma/ al ejecutar las migraciones.

### CORS
El backend permite requests desde http://localhost:5173. 

## Características Implementadas

### Autenticación Completa
Sistema de registro y login con JWT. Tokens almacenados en cookies HttpOnly para máxima seguridad. Middleware de autenticación valida tokens en rutas protegidas.

### Gestión de Colección
Usuarios pueden añadir Pokémon a su colección personal. Cada item puede tener una nota personalizada. Eliminación de items con confirmación visual.

### Integración con PokeAPI
Consumo de PokeAPI para obtener datos oficiales de Pokémon. Sprites de alta calidad del artwork oficial. Endpoint personalizado en frontend para cachear y transformar datos.

### Búsqueda en Tiempo Real
Buscador con filtrado instantáneo mientras se escribe. Funciona sobre los Pokémon cargados en la página actual.

### Paginación
Navegación por páginas de 20 Pokémon. Botones Previous y Next con estados disabled apropiados.

### Modal de Autenticación
Usuarios sin sesión pueden explorar libremente. Al intentar añadir a colección, aparece modal para login o registro sin perder contexto.

### Diseño Responsivo
Grid adaptativo que muestra 1, 2, 3 o 4 columnas según el tamaño de pantalla. Navbar responsive con ajuste de espaciado.

### Animaciones Sutiles
Hover effects suaves en cards con scale-105. Pokéballs girando lentamente con animación de 6 segundos. Transiciones smooth en todos los estados.

## Validaciones

### Backend
Validación con Zod en todos los endpoints. Verificación de formato de email. Longitud mínima de contraseña. Sanitización de inputs.

### Frontend
Validación de campos requeridos en formularios. Feedback visual inmediato de errores. Mensajes de error claros y específicos.

## Seguridad

- Contraseñas hasheadas con bcrypt y salt rounds
- JWT firmado con secret key
- Cookies HttpOnly para prevenir XSS
- Validación de ownership en operaciones de colección
- CORS configurado específicamente
- Prepared statements de Prisma previenen SQL injection

## Documentación del Código

### Backend - Arquitectura en Capas

El backend sigue una arquitectura en capas separando responsabilidades entre routes, services y repositories.

#### Capa de Rutas - auth.ts

Las rutas definen los endpoints HTTP y manejan request/response. Usan Zod para validación de entrada.

```typescript
const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/register', async (req, res) => {
  const { email, password } = authSchema.parse(req.body);
  const result = await AuthService.register(email, password);
  
  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  
  res.status(201).json({ user: result.user });
});
```

La ruta valida el body con Zod, delega la lógica al servicio, y establece una cookie segura con el token JWT. Las cookies tienen httpOnly para prevenir acceso desde JavaScript y sameSite strict para protección CSRF.

#### Capa de Servicios - AuthService.ts

Los servicios contienen la lógica de negocio. No conocen detalles de HTTP.

```typescript
async register(email: string, password: string) {
  const existing = await UserRepository.findByEmail(email);
  if (existing) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserRepository.create(email, hashedPassword);

  const token = generateToken(user.id);
  return { user: { id: user.id, email: user.email }, token };
}
```

El servicio verifica si el email existe, hashea la contraseña con bcrypt usando 10 salt rounds, crea el usuario en la base de datos y genera un JWT. Retorna el usuario sin password y el token.

#### Capa de Repositorios - UserRepository.ts

Los repositorios abstraen el acceso a datos. Usan Prisma Client.

```typescript
async findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

async create(email: string, password: string) {
  return prisma.user.create({
    data: { email, password },
  });
}
```

Los métodos del repositorio son simples wrappers de Prisma que permiten cambiar el ORM sin afectar los servicios.

#### Middleware de Autenticación - auth.ts

El middleware valida tokens JWT en rutas protegidas.

```typescript
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

Lee el token de las cookies, lo verifica usando jwt.verify y agrega el userId al objeto request para uso en rutas protegidas. Si falla, retorna 401.

#### Generación de JWT - jwt.ts

```typescript
export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: number } {
  return jwt.verify(token, JWT_SECRET) as { userId: number };
}
```

Los tokens expiran en 7 días. El secret se lee de variables de entorno.

### Frontend - Context API y Hooks

#### AuthContext - Gestión de Estado Global

El contexto maneja el estado de autenticación en toda la aplicación.

```typescript
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const data = await authService.login(email, password);
    setUser(data.user);
  }
}
```

En el mount inicial, intenta obtener el usuario actual. Si la cookie es válida, el backend retorna los datos del usuario. Las funciones login y register actualizan el estado local después de llamar al API.

#### Custom Hook - useAuth

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

Este hook simplifica el acceso al contexto y lanza error si se usa fuera del provider.

#### Servicios API - authService.ts

Los servicios encapsulan las llamadas al backend.

```typescript
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}
```

La función fetchAPI es un wrapper de fetch que incluye credentials para enviar cookies, maneja errores de forma consistente y parsea JSON automáticamente.

#### pokemonService - Integración con PokeAPI

```typescript
async getById(id: number): Promise<Pokemon> {
  const response = await fetch(`${POKEAPI_URL}/pokemon/${id}`);
  if (!response.ok) throw new Error('Failed to fetch pokemon');
  return response.json();
}
```

Los servicios de Pokémon hablan directamente con PokeAPI. No requieren autenticación. Retornan objetos tipados con TypeScript.

### Componentes - Arquitectura de UI

#### PokemonCard - Componente con Estado y Modal

```typescript
export function PokemonCard({ id, name, imageUrl }: PokemonCardProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  async function handleAddToCollection(e: React.MouseEvent) {
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    await collectionService.addPokemon(id, name, imageUrl);
  }
}
```

El componente verifica si hay usuario antes de añadir a colección. Si no hay sesión, muestra el modal de autenticación. El stopPropagation previene que el click del botón active la navegación del card.

#### ProtectedRoute - Higher Order Component

```typescript
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
```

Este componente verifica autenticación antes de renderizar rutas protegidas. Muestra loading mientras verifica, redirige a login si no hay usuario, y renderiza children si está autenticado.

### Flujo de Autenticación Completo

1. Usuario ingresa email y password en LoginPage
2. LoginPage llama authService.login con credentials
3. authService hace POST a /api/auth/login con credentials included
4. Backend valida con Zod, busca usuario en DB, compara password hasheado
5. Backend genera JWT y lo envía en cookie HttpOnly
6. Frontend recibe respuesta con datos de usuario
7. AuthContext actualiza estado con setUser
8. Toda la app re-renderiza con usuario autenticado
9. Navbar muestra email y opciones de logout
10. ProtectedRoute permite acceso a /collection

### Flujo de Añadir a Colección

1. Usuario hace click en botón "Add to Collection" en PokemonCard
2. Componente verifica si user existe en contexto
3. Si no hay user, abre modal con formulario login/register
4. Usuario se autentica, modal se cierra
5. Click en botón nuevamente
6. Ahora user existe, llama collectionService.addPokemon
7. Service hace POST a /api/collection con credentials
8. Backend middleware verifica JWT en cookie
9. Backend extrae userId del token
10. Backend crea CollectionItem con userId, pokemonId, name, spriteUrl
11. Frontend muestra mensaje de éxito
12. Usuario navega a /collection y ve el Pokémon guardado

### Tipado TypeScript

#### Types comunes - types/index.ts

```typescript
export interface User {
  id: number;
  email: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}
```

Las interfaces definen la estructura de datos en toda la aplicación. El tipado previene errores en tiempo de desarrollo.

### Estilos con Tailwind

#### Configuración personalizada

```javascript
colors: {
  pokemon: {
    red: '#EE1515',
    yellow: '#FFCB05',
    navy: '#1e3a5f',
    cream: '#f5e6d3',
    orange: '#FF6B35',
  },
},
animation: {
  'spin-slow': 'spin 6s linear infinite',
},
```

Se extiende Tailwind con colores personalizados del tema Pokédex. La animación spin-slow se usa en los logos de Pokéball.

#### Uso en componentes

```tsx
<Card className="bg-pokemon-cream border-2 border-pokemon-cream-dark">
  <Button className="bg-pokemon-red hover:opacity-90">
    Add to Collection
  </Button>
</Card>
```

Los componentes usan las clases personalizadas. El hover es subtle con opacity en lugar de transform scale.

### Manejo de Errores

#### Backend

```typescript
try {
  const result = await AuthService.login(email, password);
  res.json(result);
} catch (error) {
  if (error instanceof Error) {
    res.status(401).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

Los errores se capturan en las rutas, se loggean y se retornan como JSON con status code apropiado.

#### Frontend

```typescript
async function handleAddToCollection() {
  setAdding(true);
  setMessage('');
  
  try {
    await collectionService.addPokemon(id, name, imageUrl);
    setMessage('Added!');
  } catch (error) {
    setMessage(error instanceof Error ? error.message : 'Failed');
  } finally {
    setAdding(false);
  }
}
```

Los errores de API se muestran al usuario con mensajes claros. Estados de loading previenen doble submit.

