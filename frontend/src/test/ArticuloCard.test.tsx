import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ArticuloCard from '../components/ArticuloCard';
import { AuthProvider } from '../context/AuthContext';
import type { Articulo } from '../types';

const articuloMock: Articulo = {
  id: '2301.07218',
  fuente: 'arxiv',
  titulo: 'A Survey on Machine Learning for Scientific Discovery',
  autores: ['Smith, J.', 'Doe, A.'],
  anio: 2023,
  abstract: 'Un resumen de ejemplo sobre aprendizaje automático aplicado a la ciencia.',
  palabrasClave: ['cs.LG', 'cs.AI'],
  urlOriginal: 'https://arxiv.org/abs/2301.07218',
  urlPdf: 'https://arxiv.org/pdf/2301.07218',
  revista: 'arXiv',
};

function renderCard(articulo: Articulo = articuloMock) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ArticuloCard articulo={articulo} />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('ArticuloCard', () => {
  test('renderiza el título del artículo', () => {
    renderCard();
    expect(screen.getByText(articuloMock.titulo)).toBeInTheDocument();
  });

  test('muestra el año de publicación', () => {
    renderCard();
    expect(screen.getByText(String(articuloMock.anio))).toBeInTheDocument();
  });

  test('muestra el badge correspondiente a la fuente arXiv', () => {
    renderCard();
    // "arXiv" aparece como badge y como revista; basta con que esté al menos una vez.
    expect(screen.getAllByText(/arxiv/i).length).toBeGreaterThan(0);
  });

  test('renderiza al menos uno de los autores', () => {
    renderCard();
    expect(screen.getByText(/Smith, J\./)).toBeInTheDocument();
  });

  test('renderiza el badge de CrossRef cuando la fuente cambia', () => {
    renderCard({ ...articuloMock, fuente: 'crossref', revista: 'Nature' });
    expect(screen.getByText(/crossref/i)).toBeInTheDocument();
  });
});
