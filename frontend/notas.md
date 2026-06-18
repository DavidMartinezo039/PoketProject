Esta api podría ser interesante
https://5e-bits.github.io/docs/api/get-monster-by-index

## Docker: dependencias nuevas
El código se actualiza solo (bind mount), pero las dependencias NO: viven en el
node_modules "horneado" en la IMAGEN (más un volumen anónimo en el contenedor).
Por eso instalar solo en local no basta. Dos formas:
- Parche RÁPIDO (temporal: se pierde si el contenedor se recrea):
  `docker compose exec frontend npm install <paquete>` + `docker compose restart frontend`
- Arreglo DURADERO (lo hornea en la imagen) → este es el bueno:
  1) añade el paquete al package.json, 2) `docker compose up -d --build --renew-anon-volumes frontend`
- Backend igual con pip/requirements.txt.