# Frontend Tintado

## Descripción

Frontend en React + Vite para la gestión de citas, clientes, vehículos, facturación y recibos en un taller de tintado de lunas. Permite la interacción con el backend mediante una interfaz moderna y responsiva.

## Requisitos previos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
cd frontend-tintado
npm install
```

## Variables de entorno

Crea un archivo `.env` basado en el ejemplo `.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts principales

- `npm run dev` — Ejecuta la app en modo desarrollo
- `npm run build` — Compila la app para producción
- `npm run preview` — Previsualiza la build de producción

## Uso

1. Configura las variables de entorno.
2. Inicia el frontend:
   ```bash
   npm run dev
   ```
3. Accede a la app en [http://localhost:5173](http://localhost:5173) (o el puerto configurado).

## Despliegue

- Define correctamente las variables de entorno en producción.
- Sube el contenido de `dist/` a tu servidor o servicio de hosting.

## Licencia

Ver archivo LICENSE.
