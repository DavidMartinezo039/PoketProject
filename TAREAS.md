# Tareas del proyecto

App de D&D — proyecto de aprendizaje (Django + React, Docker).
_Última actualización: 2026-06-18_

Leyenda: `[x]` hecho · `[~]` a medias / mejorable · `[ ]` pendiente

---

## ✅ Hecho

### Infraestructura
- [x] `docker-compose` con 3 servicios: `db` (postgres 16), `backend` (Django), `frontend` (Vite)
- [x] Hot-reload del frontend sin rebuild (bind mount `./frontend:/app`)
- [x] Aprendido: las dependencias nuevas NO entran solas → hay que reconstruir la imagen (ver `frontend/notas.md`)

### Backend (Django + DRF)
- [x] App `accounts` con modelo `User` personalizado (`AbstractUser`) + `AUTH_USER_MODEL`
- [x] App `core` creada (esqueleto)
- [x] Login con token: `POST /api/auth/login/` → `{ token }` (DRF `obtain_auth_token`)
- [x] Endpoint lista de usuarios: `GET /api/usuarios/` (`ListAPIView` + serializer)

### Frontend (React + TypeScript)
- [x] `LoginPage` con diseño (canvas de partículas, tilt 3D, ripple) + login real contra el backend
- [x] Enrutado con react-router v7: **layout route** (`MenuLayout` con `<Outlet>` + `<NavLink>`) y rutas anidadas
- [x] Rutas protegidas (`RutaProtegida` envolviendo el layout) — sin token, redirige al login
- [x] Reestructura **por tipo**: `api/`, `hooks/`, `layouts/`, `pages/`
  - [x] `api/auth.ts` (`login`), `api/usuarios.ts` (`getUsuarios`)
  - [x] `hooks/useParticles.ts` (animación del fondo)
  - [x] `pages/`: `LoginPage`, `InicioPage`, `UsuariosPage`
- [x] `UsuariosPage`: fetch + render de la lista con `useState`/`useEffect` (estados: cargando / lista / vacío)

---

## 🚧 Siguiente (lo más cercano)

### Asegurar y mejorar el endpoint de usuarios
- [ ] **Proteger** `/api/usuarios/` con `TokenAuthentication` + `IsAuthenticated` (Etapa 3) y mandar la cabecera `Authorization: Token …` desde `getUsuarios`
- [ ] Ampliar campos del serializer (`id`, `email`, `first_name`, `last_name`, `date_joined`)
- [ ] Usar `id` como `key` en el `.map()` (ahora usa `username`)
- [ ] Manejar el estado de **error** en `UsuariosPage` (el `getUsuarios().then(...)` no tiene `.catch`)
- [ ] Estilar la lista de usuarios (tabla/tarjetas) — _CSS lo hace Claude_

### Limpieza / consistencia (deuda técnica acordada)
- [~] Sacar `User = get_user_model()` **fuera** de `class Meta` en `serializers.py`
- [~] Renombrar para que el nombre diga la verdad: `AccountSerializer` → `UserSerializer`, `AccountsList` → `UsuariosList`
- [ ] Centralizar la URL base de la API (`api/client.ts` o `import.meta.env`) en vez de repetir `http://localhost:8013/api…`
- [ ] Unificar convención de imports (extensión `.tsx` sí/no)

---

## 📋 Pendiente / ideas

### Backend
- [ ] Paginación en la lista de usuarios
- [ ] Filtrar el queryset (¿excluir inactivos / superuser?)
- [ ] Campos propios en `User` (teléfono, rol…) → `makemigrations`

### Frontend
- [ ] Contenido real de `InicioPage` (dashboard)
- [ ] Crear / editar / eliminar usuarios desde el front (no solo listar)
- [ ] Redirigir `/` → `/inicio` si ya hay token
- [ ] Ruta 404 / catch-all (`path="*"`)

---

## 🧩 Fase 2 (cuando el front web esté dominado)
- [ ] Móvil con **Expo / React Native**, reutilizando la misma API

---

## 📝 Notas
- Gotchas de entorno (Docker + dependencias): `frontend/notas.md`
