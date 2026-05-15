import { describe, test, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import { AuthProvider } from '../context/AuthContext';

function renderConRutas(initialEntries: string[] = ['/protegida']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <Routes>
          <Route
            path="/protegida"
            element={
              <PrivateRoute>
                <div>Contenido privado</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Página de login</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('PrivateRoute', () => {
  test('redirige a /login cuando no hay sesión activa', async () => {
    renderConRutas();
    // El AuthProvider arranca con loading=true y luego se vuelve false;
    // esperamos a que se complete la transición antes de comprobar.
    await waitFor(() => {
      expect(screen.getByText('Página de login')).toBeInTheDocument();
    });
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument();
  });

  test('renderiza el contenido protegido cuando hay sesión en localStorage', async () => {
    localStorage.setItem('scilens_token', 'fake-jwt');
    localStorage.setItem(
      'scilens_usuario',
      JSON.stringify({
        id: '1',
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'usuario',
        areasInteres: [],
      })
    );

    renderConRutas();
    await waitFor(() => {
      expect(screen.getByText('Contenido privado')).toBeInTheDocument();
    });
  });
});
