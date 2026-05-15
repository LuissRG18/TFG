import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegistroPage from '../pages/RegistroPage';
import { AuthProvider } from '../context/AuthContext';
import * as authService from '../services/authService';

vi.mock('../services/authService', () => ({
  loginRequest: vi.fn(),
  registroRequest: vi.fn(),
  obtenerPerfilRequest: vi.fn(),
}));

function renderRegistro() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RegistroPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('RegistroPage', () => {
  test('renderiza todos los campos del formulario', () => {
    renderRegistro();
    expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repite la contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
  });

  test('muestra un error si las contraseñas no coinciden y no llama al servicio', async () => {
    const user = userEvent.setup();
    renderRegistro();

    await user.type(screen.getByPlaceholderText('Tu nombre'), 'María');
    await user.type(screen.getByPlaceholderText('tu@email.com'), 'maria@example.com');
    await user.type(screen.getByPlaceholderText('Mínimo 6 caracteres'), 'password123');
    await user.type(screen.getByPlaceholderText('Repite la contraseña'), 'otraDistinta1');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText(/no coinciden/i)).toBeInTheDocument();
    });
    expect(authService.registroRequest).not.toHaveBeenCalled();
  });

  test('llama a registroRequest con los datos del formulario cuando es válido', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.registroRequest).mockResolvedValue({
      ok: true,
      token: 'jwt-fake',
      usuario: { id: '1', nombre: 'María', email: 'maria@example.com', rol: 'usuario', areasInteres: [] },
    });

    renderRegistro();
    await user.type(screen.getByPlaceholderText('Tu nombre'), 'María');
    await user.type(screen.getByPlaceholderText('tu@email.com'), 'maria@example.com');
    await user.type(screen.getByPlaceholderText('Mínimo 6 caracteres'), 'password123');
    await user.type(screen.getByPlaceholderText('Repite la contraseña'), 'password123');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(authService.registroRequest).toHaveBeenCalledWith('María', 'maria@example.com', 'password123');
    });
  });
});
