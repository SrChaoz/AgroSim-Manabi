# AgroSim Manabí

Plataforma sin autenticación para dibujar parcelas, modelar escenarios de riego y clima, y obtener diagnósticos agronómicos regionalizados para Manabí, Ecuador.

## Inicio

1. Copia `.env.example` como `.env.local` y establece `OPENAI_API_KEY`.
2. Instala dependencias con `npm install`.
3. Ejecuta `npm run dev`.

Los endpoints `/api/simulate` y `/api/diagnose` validan las respuestas del modelo contra un esquema Zod y solicitan Structured Outputs mediante `response_format: { type: "json_schema" }`.

> Las salidas son apoyo a la decisión y requieren la validación de un técnico agrónomo en campo.
