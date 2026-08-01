/// <reference types="vite/types/importMeta.d.ts" />
const PRODUCTION_CALCULATOR_API_URL =
  "https://pisterajat-api-546628865246.europe-north1.run.app/api/v1";

export const CALCULATOR_API_URL = import.meta.env.DEV
  ? "http://localhost:8000/api/v1"
  : PRODUCTION_CALCULATOR_API_URL;

export const CALCULATOR_API_TIMEOUT_MS = 10_000;
