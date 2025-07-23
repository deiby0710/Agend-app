import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const EXCEL_FILE_CITAS = path.join(
  __dirname,
  '../',
  '../',
  'Reporte',
  'reporte_citas.xlsx'
);