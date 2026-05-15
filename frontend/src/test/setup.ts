import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Tras cada test desmonta los componentes renderizados y limpia localStorage
// para que los tests sean independientes entre sí.
afterEach(() => {
  cleanup();
  localStorage.clear();
});
