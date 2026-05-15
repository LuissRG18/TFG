import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import * as authService from '../services/authService';

// Mock del servicio de auth para no depender del backend real durante los tests.
vi.mock('../services/authService', () => ({
  loginRequest: vi.fn(),
  registroRequest: vi.fn(),
  obtenerPerfilRequest: vi.fn(),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LoginPage', () => {
  test('renderiza los campos email, contraseña y el botón Acceder', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /acceder/i })).toBeInTheDocument();
  });

  test('al enviar credenciales correctas llama a loginRequest con email y password', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.loginRequest).mockResolvedValue({
      ok: true,
      token: 'jwt-fake',
      usuario: { id: '1', nombre: 'Test', email: 'test@example.com', rol: 'usuario', areasInteres: [] },
    });

    renderLogin();
    await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
    await user.click(screen.getByRole('button', { name: /acceder/i }));

    await waitFor(() => {
      expect(authService.loginRequest).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('muestra un banner de error si el login falla', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.loginRequest).mockResolvedValue({
      ok: false,
      mensaje: 'Credenciales inválidas.',
    });

    renderLogin();
    await user.type(screen.getByPlaceholderText('tu@email.com'), 'mal@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'malpass1');
    await user.click(screen.getByRole('button', { name: /acceder/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });
  });
});
